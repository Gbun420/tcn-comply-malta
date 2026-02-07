export function SectionHeading({
  kicker,
  title,
  description,
  align = 'left',
  className = '',
  level = 2,
}) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  const HeadingTag = `h${level}`

  return (
    <div className={`mb-8 flex flex-col gap-3 ${alignment} ${className}`.trim()}>
      {kicker ? <span className="glass-chip">{kicker}</span> : null}
      <HeadingTag className="font-display text-balance text-3xl font-semibold text-white md:text-4xl">
        {title}
      </HeadingTag>
      {description ? <p className="max-w-3xl text-slate-200/90">{description}</p> : null}
    </div>
  )
}
