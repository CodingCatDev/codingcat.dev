
import React from 'react';

export default function BlockTable({ value }: { value: { rows: { _key: string; cells: string[] }[] } }) {
  const { rows } = value;
  if (!rows) {
    return null;
  }
  return (
    <table>
      <tbody>
        {rows.map((row) => (
          <tr key={row._key}>
            {row.cells.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
