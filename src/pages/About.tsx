function About() {
  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">About</h1>
      <p className="mt-2 text-slate-600">
        このページは <code className="rounded bg-slate-200 px-1 py-0.5">/about</code> に 対応しています。React Router
        がパスに応じてコンポーネントを切り替えています。
      </p>
    </section>
  )
}

export default About
