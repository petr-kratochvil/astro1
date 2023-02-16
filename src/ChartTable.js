export default function ChartTable({chart, title}) {
  return (
    
        <div>
          <table className="MyTable">
            <tbody>
              <tr>
                <td className="MyTableHeading" colSpan="5">{title}</td>
              </tr>
              {chart.map(a => <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.sign}</td>
                <td>{a.degrees}°</td>
                <td>{a.minutes}'</td>
                <td>{a.retrograde ? 'r' : ''}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
        
  )
}