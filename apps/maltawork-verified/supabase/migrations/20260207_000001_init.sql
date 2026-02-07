-- MaltaWork Verified initial schema

create extension if not exists pgcrypto;

-- Helpers
create or replace function public.mwv_role()
returns text
language sql
stable
as $$
  select role from public.profiles where user_id = auth.uid();
$$;

create or replace function public.mwv_is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(public.mwv_role() = 'admin', false);
$$;

create or replace function public.mwv_is_employer()
returns boolean
language sql
stable
as $$
  select coalesce(public.mwv_role() = 'employer', false);
$$;

-- Profiles (role map)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user','employer','admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy profiles_select_own
  on public.profiles for select
  using (auth.uid() = user_id or public.mwv_is_admin());

create policy profiles_insert_own
  on public.profiles for insert
  with check (auth.uid() = user_id or public.mwv_is_admin());

create policy profiles_update_admin_only
  on public.profiles for update
  using (public.mwv_is_admin())
  with check (public.mwv_is_admin());

-- Auto-provision profile rows on signup
create or replace function public.mwv_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists mwv_on_auth_user_created on auth.users;
create trigger mwv_on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.mwv_handle_new_user();

-- Core entities
create table if not exists public.employers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  industry text,
  size text,
  website text,
  locations jsonb not null default '[]'::jsonb,
  claim_status text not null default 'unclaimed',
  verified_status text not null default 'unverified',
  owner_user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.employers enable row level security;

create policy employers_select_owner_or_admin
  on public.employers for select
  using (public.mwv_is_admin() or owner_user_id = auth.uid());

create policy employers_insert_admin_only
  on public.employers for insert
  with check (public.mwv_is_admin());

create policy employers_update_owner_or_admin
  on public.employers for update
  using (public.mwv_is_admin() or owner_user_id = auth.uid())
  with check (public.mwv_is_admin() or owner_user_id = auth.uid());

create table if not exists public.employer_claims (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  requester_user_id uuid not null references auth.users(id) on delete cascade,
  domain_email text not null,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.employer_claims enable row level security;

create policy employer_claims_insert_authenticated
  on public.employer_claims for insert
  with check (auth.uid() = requester_user_id);

create policy employer_claims_select_requester_or_admin
  on public.employer_claims for select
  using (public.mwv_is_admin() or requester_user_id = auth.uid());

create policy employer_claims_update_admin_only
  on public.employer_claims for update
  using (public.mwv_is_admin())
  with check (public.mwv_is_admin());

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  title text not null,
  slug text not null unique,
  description text not null,
  location text not null,
  remote_type text not null,
  employment_type text not null,
  category text not null,
  salary_min int,
  salary_max int,
  currency text not null default 'EUR',
  status text not null default 'draft' check (status in ('draft','published','closed')),
  moderation_status text not null default 'visible' check (moderation_status in ('visible','temp_hidden','removed')),
  featured_until timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.jobs enable row level security;

create policy jobs_select_employer_owner_or_admin
  on public.jobs for select
  using (
    public.mwv_is_admin()
    or exists (
      select 1 from public.employers e
      where e.id = jobs.employer_id and e.owner_user_id = auth.uid()
    )
  );

create policy jobs_insert_employer_owner
  on public.jobs for insert
  with check (
    public.mwv_is_admin()
    or exists (
      select 1 from public.employers e
      where e.id = jobs.employer_id and e.owner_user_id = auth.uid()
    )
  );

create policy jobs_update_employer_owner_or_admin
  on public.jobs for update
  using (
    public.mwv_is_admin()
    or exists (
      select 1 from public.employers e
      where e.id = jobs.employer_id and e.owner_user_id = auth.uid()
    )
  )
  with check (
    public.mwv_is_admin()
    or exists (
      select 1 from public.employers e
      where e.id = jobs.employer_id and e.owner_user_id = auth.uid()
    )
  );

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  applicant_user_id uuid not null references auth.users(id) on delete cascade,
  resume_url text,
  cover_letter text,
  stage text not null default 'New' check (stage in ('New','Shortlisted','Interview','Offer','Rejected','Hired')),
  created_at timestamptz not null default now()
);

alter table public.applications enable row level security;

create policy applications_insert_applicant
  on public.applications for insert
  with check (auth.uid() = applicant_user_id);

create policy applications_select_applicant_or_employer_or_admin
  on public.applications for select
  using (
    public.mwv_is_admin()
    or applicant_user_id = auth.uid()
    or exists (
      select 1
      from public.jobs j
      join public.employers e on e.id = j.employer_id
      where j.id = applications.job_id and e.owner_user_id = auth.uid()
    )
  );

create policy applications_update_employer_or_admin
  on public.applications for update
  using (
    public.mwv_is_admin()
    or exists (
      select 1
      from public.jobs j
      join public.employers e on e.id = j.employer_id
      where j.id = applications.job_id and e.owner_user_id = auth.uid()
    )
  )
  with check (
    public.mwv_is_admin()
    or exists (
      select 1
      from public.jobs j
      join public.employers e on e.id = j.employer_id
      where j.id = applications.job_id and e.owner_user_id = auth.uid()
    )
  );

-- Reviews (private by default; public only via views)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.employers(id) on delete cascade,
  author_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'draft'
    check (status in ('draft','submitted','verification_pending','needs_changes','rejected','published','removed','temp_hidden')),
  overall smallint not null check (overall between 1 and 5),
  management smallint not null check (management between 1 and 5),
  worklife smallint not null check (worklife between 1 and 5),
  pay_fairness smallint not null check (pay_fairness between 1 and 5),
  structured_answers jsonb not null default '{}'::jsonb,
  narrative_raw text,
  narrative_redacted text,
  submitted_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy reviews_insert_author
  on public.reviews for insert
  with check (auth.uid() = author_user_id);

create policy reviews_select_author_or_admin
  on public.reviews for select
  using (public.mwv_is_admin() or auth.uid() = author_user_id);

create policy reviews_update_author_drafts
  on public.reviews for update
  using (
    public.mwv_is_admin()
    or (auth.uid() = author_user_id and status in ('draft','needs_changes'))
  )
  with check (
    public.mwv_is_admin()
    or (auth.uid() = author_user_id and status in ('draft','needs_changes'))
  );

-- Evidence vault metadata
create table if not exists public.review_evidence (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  uploader_user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  evidence_type text not null,
  status text not null default 'pending' check (status in ('pending','verified','rejected','deleted')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.review_evidence enable row level security;

create policy review_evidence_insert_uploader
  on public.review_evidence for insert
  with check (
    public.mwv_is_admin()
    or (
      auth.uid() = uploader_user_id
      and exists (
        select 1 from public.reviews r
        where r.id = review_evidence.review_id and r.author_user_id = auth.uid()
      )
    )
  );

create policy review_evidence_select_uploader_or_admin
  on public.review_evidence for select
  using (
    public.mwv_is_admin()
    or (
      auth.uid() = uploader_user_id
      and exists (
        select 1 from public.reviews r
        where r.id = review_evidence.review_id and r.author_user_id = auth.uid()
      )
    )
  );

create policy review_evidence_update_admin_only
  on public.review_evidence for update
  using (public.mwv_is_admin())
  with check (public.mwv_is_admin());

-- Employer responses (also pre-moderated)
create table if not exists public.employer_review_responses (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  employer_id uuid not null references public.employers(id) on delete cascade,
  responder_user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'draft'
    check (status in ('draft','submitted','published','rejected','removed')),
  response_raw text not null,
  response_redacted text not null,
  submitted_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.employer_review_responses enable row level security;

create policy employer_review_responses_insert_employer_owner
  on public.employer_review_responses for insert
  with check (
    public.mwv_is_admin()
    or (
      responder_user_id = auth.uid()
      and exists (
        select 1 from public.employers e
        where e.id = employer_review_responses.employer_id and e.owner_user_id = auth.uid()
      )
    )
  );

create policy employer_review_responses_select_employer_owner_or_admin
  on public.employer_review_responses for select
  using (
    public.mwv_is_admin()
    or exists (
      select 1 from public.employers e
      where e.id = employer_review_responses.employer_id and e.owner_user_id = auth.uid()
    )
  );

create policy employer_review_responses_update_employer_drafts_or_admin
  on public.employer_review_responses for update
  using (
    public.mwv_is_admin()
    or (
      status in ('draft','submitted')
      and exists (
        select 1 from public.employers e
        where e.id = employer_review_responses.employer_id and e.owner_user_id = auth.uid()
      )
    )
  )
  with check (
    public.mwv_is_admin()
    or (
      status in ('draft','submitted')
      and exists (
        select 1 from public.employers e
        where e.id = employer_review_responses.employer_id and e.owner_user_id = auth.uid()
      )
    )
  );

-- DSA intake
create table if not exists public.dsa_notices (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('review','job','employer','response')),
  target_id uuid,
  url_or_location text not null,
  reporter_email text not null,
  reason text not null,
  legal_basis text,
  status text not null default 'open' check (status in ('open','actioned','rejected')),
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.dsa_notices enable row level security;

create policy dsa_notices_insert_anyone
  on public.dsa_notices for insert
  with check (true);

create policy dsa_notices_select_admin_only
  on public.dsa_notices for select
  using (public.mwv_is_admin());

create policy dsa_notices_update_admin_only
  on public.dsa_notices for update
  using (public.mwv_is_admin())
  with check (public.mwv_is_admin());

create table if not exists public.dsa_complaints (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id uuid,
  complainant_user_id uuid references auth.users(id),
  complainant_email text,
  complaint text not null,
  status text not null default 'open' check (status in ('open','upheld','denied')),
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.dsa_complaints enable row level security;

create policy dsa_complaints_insert_anyone
  on public.dsa_complaints for insert
  with check (true);

create policy dsa_complaints_select_admin_only
  on public.dsa_complaints for select
  using (public.mwv_is_admin());

create policy dsa_complaints_update_admin_only
  on public.dsa_complaints for update
  using (public.mwv_is_admin())
  with check (public.mwv_is_admin());

-- Statements of reasons for moderation actions
create table if not exists public.statements_of_reasons (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id uuid not null,
  action text not null check (action in ('publish','reject','remove','restrict','temp_hide','restore','needs_changes')),
  basis text not null check (basis in ('illegal_content','policy_violation')),
  explanation text not null,
  scope text not null,
  duration text,
  created_at timestamptz not null default now()
);

alter table public.statements_of_reasons enable row level security;

create policy sor_admin_only
  on public.statements_of_reasons for all
  using (public.mwv_is_admin())
  with check (public.mwv_is_admin());

-- Audit log (append-only)
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

create policy audit_admin_only
  on public.audit_log for insert
  with check (public.mwv_is_admin());

create policy audit_admin_select
  on public.audit_log for select
  using (public.mwv_is_admin());

create or replace function public.mwv_forbid_audit_mutations()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_log is append-only';
end;
$$;

drop trigger if exists mwv_audit_no_update on public.audit_log;
drop trigger if exists mwv_audit_no_delete on public.audit_log;

create trigger mwv_audit_no_update before update on public.audit_log
  for each row execute procedure public.mwv_forbid_audit_mutations();

create trigger mwv_audit_no_delete before delete on public.audit_log
  for each row execute procedure public.mwv_forbid_audit_mutations();

-- SAFE PUBLIC VIEWS (no reviewer identity, no raw narrative)
create or replace view public.published_reviews_public_view as
  select
    r.id,
    r.employer_id,
    r.overall,
    r.management,
    r.worklife,
    r.pay_fairness,
    r.structured_answers,
    r.narrative_redacted,
    r.published_at
  from public.reviews r
  where r.status = 'published';

create or replace view public.published_jobs_public_view as
  select
    j.id,
    j.employer_id,
    j.title,
    j.slug,
    j.description,
    j.location,
    j.remote_type,
    j.employment_type,
    j.category,
    j.salary_min,
    j.salary_max,
    j.currency,
    j.featured_until,
    j.expires_at,
    j.created_at
  from public.jobs j
  where j.status = 'published'
    and j.moderation_status = 'visible'
    and (j.expires_at is null or j.expires_at > now());

create or replace view public.employers_public_view as
  select
    e.id,
    e.name,
    e.slug,
    e.industry,
    e.size,
    e.website,
    e.locations,
    e.claim_status,
    e.verified_status,
    e.created_at
  from public.employers e;

-- Public transparency counts (aggregated only)
create or replace view public.mwv_transparency_counts_view as
  select
    (select count(*) from public.dsa_notices where status = 'open')::int as notices_open,
    (select count(*) from public.dsa_notices where status = 'actioned')::int as notices_actioned,
    (select count(*) from public.dsa_notices where status = 'rejected')::int as notices_rejected,
    (select count(*) from public.dsa_complaints where status = 'open')::int as complaints_open,
    (select count(*) from public.dsa_complaints where status = 'upheld')::int as complaints_upheld,
    (select count(*) from public.dsa_complaints where status = 'denied')::int as complaints_denied,
    (select count(*) from public.statements_of_reasons where action = 'publish')::int as decisions_publish,
    (select count(*) from public.statements_of_reasons where action = 'reject')::int as decisions_reject,
    (select count(*) from public.statements_of_reasons where action = 'needs_changes')::int as decisions_needs_changes,
    (select count(*) from public.statements_of_reasons where action = 'remove')::int as decisions_remove,
    (select count(*) from public.statements_of_reasons where action = 'temp_hide')::int as decisions_temp_hide,
    (select count(*) from public.statements_of_reasons where action = 'restore')::int as decisions_restore;

-- Grants: deny anon base table access, allow safe view access.
-- NOTE: Do not revoke from `authenticated` because RLS policies handle safe access for signed-in users.
revoke all on table public.reviews from anon;
revoke all on table public.jobs from anon;
revoke all on table public.employers from anon;
revoke all on table public.employer_review_responses from anon;
revoke all on table public.review_evidence from anon;
revoke all on table public.audit_log from anon;
revoke all on table public.statements_of_reasons from anon;

grant select on table public.published_reviews_public_view to anon;
grant select on table public.published_jobs_public_view to anon;
grant select on table public.employers_public_view to anon;
grant select on table public.mwv_transparency_counts_view to anon;

-- DSA intake: allow anyone to submit.
grant insert on table public.dsa_notices to anon;
grant insert on table public.dsa_complaints to anon;

-- Storage: evidence vault bucket + policies
insert into storage.buckets (id, name, public)
values ('evidence_private', 'evidence_private', false)
on conflict (id) do nothing;

alter table storage.objects enable row level security;

-- Upload allowed for authenticated users only, to a prefix of their user id.
-- Download/list is denied for non-admin.

drop policy if exists mwv_storage_insert_user_prefix on storage.objects;
create policy mwv_storage_insert_user_prefix
  on storage.objects for insert
  with check (
    bucket_id = 'evidence_private'
    and auth.role() = 'authenticated'
    and split_part(name, '/', 1) = auth.uid()::text
  );

drop policy if exists mwv_storage_select_admin_only on storage.objects;
create policy mwv_storage_select_admin_only
  on storage.objects for select
  using (public.mwv_is_admin() and bucket_id = 'evidence_private');

drop policy if exists mwv_storage_update_admin_only on storage.objects;
create policy mwv_storage_update_admin_only
  on storage.objects for update
  using (public.mwv_is_admin() and bucket_id = 'evidence_private')
  with check (public.mwv_is_admin() and bucket_id = 'evidence_private');

drop policy if exists mwv_storage_delete_admin_only on storage.objects;
create policy mwv_storage_delete_admin_only
  on storage.objects for delete
  using (public.mwv_is_admin() and bucket_id = 'evidence_private');

-- Admin moderation decision (transactional): review status + statement of reasons + audit log
create or replace function public.mwv_admin_decide_review(
  p_review_id uuid,
  p_new_status text,
  p_action text,
  p_basis text,
  p_explanation text,
  p_scope text,
  p_duration text
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_actor uuid;
begin
  v_actor := auth.uid();
  if not public.mwv_is_admin() then
    raise exception 'admin_only';
  end if;

  update public.reviews
  set
    status = p_new_status,
    published_at = case when p_action = 'publish' then now() else published_at end
  where id = p_review_id;

  insert into public.statements_of_reasons (target_type, target_id, action, basis, explanation, scope, duration)
  values ('review', p_review_id, p_action, p_basis, p_explanation, p_scope, nullif(p_duration, ''));

  insert into public.audit_log (actor_user_id, action, entity, entity_id, meta)
  values (v_actor, p_action, 'review', p_review_id, jsonb_build_object('new_status', p_new_status));
end;
$$;

grant execute on function public.mwv_admin_decide_review(uuid, text, text, text, text, text, text) to authenticated;

-- Admin moderation decision (transactional): response status + statement of reasons + audit log
create or replace function public.mwv_admin_decide_response(
  p_response_id uuid,
  p_new_status text,
  p_action text,
  p_basis text,
  p_explanation text,
  p_scope text,
  p_duration text
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_actor uuid;
begin
  v_actor := auth.uid();
  if not public.mwv_is_admin() then
    raise exception 'admin_only';
  end if;

  update public.employer_review_responses
  set
    status = p_new_status,
    published_at = case when p_action = 'publish' then now() else published_at end
  where id = p_response_id;

  insert into public.statements_of_reasons (target_type, target_id, action, basis, explanation, scope, duration)
  values ('response', p_response_id, p_action, p_basis, p_explanation, p_scope, nullif(p_duration, ''));

  insert into public.audit_log (actor_user_id, action, entity, entity_id, meta)
  values (v_actor, p_action, 'response', p_response_id, jsonb_build_object('new_status', p_new_status));
end;
$$;

grant execute on function public.mwv_admin_decide_response(uuid, text, text, text, text, text, text) to authenticated;

-- Admin job restriction/hide/remove/restore with statements + audit
create or replace function public.mwv_admin_decide_job(
  p_job_id uuid,
  p_new_moderation_status text,
  p_action text,
  p_basis text,
  p_explanation text,
  p_scope text,
  p_duration text
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_actor uuid;
begin
  v_actor := auth.uid();
  if not public.mwv_is_admin() then
    raise exception 'admin_only';
  end if;

  update public.jobs
  set moderation_status = p_new_moderation_status
  where id = p_job_id;

  insert into public.statements_of_reasons (target_type, target_id, action, basis, explanation, scope, duration)
  values ('job', p_job_id, p_action, p_basis, p_explanation, p_scope, nullif(p_duration, ''));

  insert into public.audit_log (actor_user_id, action, entity, entity_id, meta)
  values (v_actor, p_action, 'job', p_job_id, jsonb_build_object('moderation_status', p_new_moderation_status));
end;
$$;

grant execute on function public.mwv_admin_decide_job(uuid, text, text, text, text, text, text) to authenticated;

-- Public view for published employer responses (redacted only)
create or replace view public.published_employer_responses_public_view as
  select
    r.id,
    r.review_id,
    r.employer_id,
    r.response_redacted,
    r.published_at
  from public.employer_review_responses r
  where r.status = 'published';

grant select on table public.published_employer_responses_public_view to anon;
