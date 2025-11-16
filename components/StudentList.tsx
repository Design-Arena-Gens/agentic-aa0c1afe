"use client";

import { useEffect, useMemo, useState } from 'react';
import styles from '../app/page.module.css';

export function StudentList({
  students,
  onChange
}: {
  students: string[];
  onChange: (next: string[]) => void;
}) {
  const [name, setName] = useState('');
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (!filter) return students;
    return students.filter((s) => s.includes(filter));
  }, [students, filter]);

  function addStudent() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (students.includes(trimmed)) return;
    onChange([...students, trimmed]);
    setName('');
  }

  function removeStudent(s: string) {
    onChange(students.filter((x) => x !== s));
  }

  useEffect(() => {
    // Ensure uniqueness and natural sort
    const unique = Array.from(new Set(students)).sort((a, b) => a.localeCompare(b, 'fa'));
    if (unique.length !== students.length || unique.some((v, i) => v !== students[i])) {
      onChange(unique);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className={styles.row}>
        <input
          className={styles.input}
          placeholder="??? ?????????"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addStudent()}
        />
        <button className={styles.button} onClick={addStudent}>??????</button>
        <input
          className={styles.input}
          placeholder="?????"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
        {filtered.map((s) => (
          <li key={s} className={styles.row} style={{ justifyContent: 'space-between' }}>
            <span>{s}</span>
            <button className={`${styles.button} ${styles.danger}`} onClick={() => removeStudent(s)}>
              ???
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li style={{ color: '#6b7280' }}>????? ???? ???</li>}
      </ul>
    </div>
  );
}
