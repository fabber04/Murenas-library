import { useCallback, useState } from 'react'
import './App.css'

const apiBaseUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:4000'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [courseId, setCourseId] = useState('')
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [type, setType] = useState<'notes'|'solution'|'exam_paper'|'textbook'>('notes')
  const [status, setStatus] = useState<string>('')

  const submit = useCallback(async () => {
    if (!file) { setStatus('Please choose a file.'); return }
    setStatus('Uploading...')
    const form = new FormData()
    form.append('file', file)
    form.append('title', title)
    form.append('course_id', courseId)
    form.append('year', String(year))
    form.append('type', type)

    try {
      const res = await fetch(`${apiBaseUrl}/materials/submissions`, { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) { setStatus(`Error: ${data.error || 'upload_failed'}`); return }
      setStatus(`Uploaded. Submission ID: ${data.id}`)
    } catch (e) {
      setStatus('Network error')
    }
  }, [file, title, courseId, year, type])

  return (
    <div className="card" style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h1>Submit Study Material</h1>
      <div className="form-row">
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Algebra Notes" />
      </div>
      <div className="form-row">
        <label>Course ID</label>
        <input value={courseId} onChange={e => setCourseId(e.target.value)} placeholder="MATH101" />
      </div>
      <div className="form-row">
        <label>Year</label>
        <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value, 10))} />
      </div>
      <div className="form-row">
        <label>Type</label>
        <select value={type} onChange={e => setType(e.target.value as any)}>
          <option value="notes">Notes</option>
          <option value="solution">Solution</option>
          <option value="exam_paper">Exam Paper</option>
          <option value="textbook">Textbook</option>
        </select>
      </div>
      <div className="form-row">
        <label>File</label>
        <input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
      </div>
      <button onClick={submit}>Upload</button>
      <p>{status}</p>
    </div>
  )
}

export default App
