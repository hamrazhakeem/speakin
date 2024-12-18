import React from 'react';
import { Star } from 'lucide-react';

const AdminTable = ({ title, columns, data, showRating, isPending }) => (
  <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden ring-1 ring-white/20">
    <h2 className="bg-white/5 p-4 font-semibold text-lg text-white border-b border-white/10">
      {title}
    </h2>
    
    <div className="overflow-x-auto">
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              {columns.map((column, index) => (
                <th key={index} className="p-4 text-left font-semibold text-gray-300">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t border-white/10 text-gray-300">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{item.name}</td>
                <td className="p-4">{item.email}</td>
                <td className="p-4">{item.language}</td>
                {title === "Language Change Requests" && (
                  <td className="p-4">{item.newLanguage}</td>
                )}
                {title !== "Language Change Requests" && (
                  <td className="p-4">{item.credits}</td>
                )}
                {showRating && (
                  <td className="p-4 flex items-center">
                    {item.rating} <Star className="w-4 h-4 text-yellow-400 ml-1" />
                  </td>
                )}
                {!isPending && title !== "Language Change Requests" && (
                  <td className="p-4">
                    <span className={`
                      inline-block px-3 py-1 rounded-full text-sm
                      ${item.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                      }
                    `}>
                      {item.status}
                    </span>
                  </td>
                )}
                <td className="p-4">{item.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-6 text-center text-gray-400">
          No {title.toLowerCase()} available at the moment.
        </div>
      )}
    </div>
  </div>
);

export default AdminTable;