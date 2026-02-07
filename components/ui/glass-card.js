export function GlassCard({ as: Tag = 'div', className = '', intense = false, children, ...props }) {
  const classes = [intense ? 'glass-panel-strong' : 'glass-panel', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  )
}
