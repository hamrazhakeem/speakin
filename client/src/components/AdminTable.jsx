import React from 'react';
import { Star } from 'lucide-react';

const AdminTable = ({ title, columns, data, showRating, isPending }) => (
    <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="bg-gray-200 p-3 font-semibold text-lg">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((column, index) => (
                <th key={index} className="p-3 text-left font-semibold">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.language}</td>
                {!isPending && <td className="p-3">{item.credits || item.details}</td>}
                {showRating && (
                  <td className="p-3 flex items-center">
                    {item.rating} <Star className="w-4 h-4 text-yellow-400 ml-1" />
                  </td>
                )}
                {!isPending && (
                  <td className="p-3">
                    <span className={`inline-block w-20 text-center px-2 py-1 rounded text-white ${item.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                      {item.status}
                    </span>
                  </td>
                )}
                <td className="p-3">
                  <button 
                    className={`inline-block w-20 px-3 py-1 rounded text-white ${
                      isPending ? 'bg-blue-500 hover:bg-blue-600' :
                      item.status === 'Active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isPending ? 'Verify' : (item.status === 'Active' ? 'Block' : 'Unblock')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

export default AdminTable