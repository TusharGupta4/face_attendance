import { useEffect, useState } from "react";
import { getAttendanceHistory } from "../services/attendance";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getAttendanceHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">

      <h1 className="text-3xl font-bold mb-6">
        Attendance History
      </h1>

      {history.length === 0 ? (
        <div className="text-gray-500">
          No attendance records found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">

          <table className="w-full">

            <thead className="bg-indigo-600 text-white">

              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Check In</th>
                <th className="p-4 text-left">Check Out</th>
              </tr>

            </thead>

            <tbody>

              {history.map((record) => (

                <tr
                  key={record.id}
                  className="border-b hover:bg-gray-100"
                >

                  <td className="p-4">
                    {new Date(record.date).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    {record.check_in
                      ? new Date(record.check_in).toLocaleTimeString()
                      : "--"}
                  </td>

                  <td className="p-4">
                    {record.check_out
                      ? new Date(record.check_out).toLocaleTimeString()
                      : "--"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}