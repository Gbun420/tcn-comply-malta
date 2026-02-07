import { GlassCard } from '../ui/glass-card.js'
import { SectionHeading } from '../ui/section-heading.js'

export function MarketingPageShell({ kicker, title, description, actions, children }) {
  return (
    <div className="space-y-8 pb-16 pt-8">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlassCard intense className="p-7 md:p-10">
          <SectionHeading
            kicker={kicker}
            title={title}
            description={description}
            className="mb-0"
            level={1}
          />
          {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
        </GlassCard>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</section>
    </div>
  )
}
