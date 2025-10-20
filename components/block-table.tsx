
import React from 'react';

export default function BlockTable({ value }: { value: { rows: { cells: string[] }[] } }) {
  const { rows } = value;
  if (!rows) {
    return null;
  }
  return (
    <table>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.cells.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
