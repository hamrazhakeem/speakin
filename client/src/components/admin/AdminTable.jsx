import React from 'react';
import { Star } from 'lucide-react';
import Avatar from '../Avatar';

const AdminTable = ({ title, columns, data, showRating, isPending }) => {
  return (
    <div className="bg-black rounded-lg border border-zinc-800 overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-zinc-800">
        <h2 className="text-lg md:text-xl font-semibold text-white flex items-center">
          {title}
          <span className="ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-zinc-800 text-zinc-300">
            {data.length}
          </span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        {data.length > 0 ? (
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  {columns.map((column, index) => (
                    <th 
                      key={index} 
                      className="px-3 md:px-6 py-3.5 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.map((item, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-zinc-900/50 transition-colors duration-200"
                  >
                    <td className="px-3 md:px-6 py-4 text-sm text-zinc-400 whitespace-nowrap">
                      #{String(item.id).padStart(3, '0')}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="hidden sm:block">
                          <Avatar 
                            src={item.avatar}
                            name={item.name}
                            size={40}
                          />
                        </div>
                        <div className="sm:ml-4">
                          <div className="text-sm font-medium text-white">{item.name}</div>
                          <div className="text-xs sm:text-sm text-zinc-400">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.language?.split(', ').map((lang, i) => (
                          <span 
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </td>
                    {title === "Language Change Requests" ? (
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {item.newLanguage}
                        </span>
                      </td>
                    ) : (
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-white">
                          {item.credits}
                        </span>
                      </td>
                    )}
                    {showRating && (
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-white">{item.rating}</span>
                          <Star className="w-4 h-4 text-yellow-400 ml-1 fill-current" />
                        </div>
                      </td>
                    )}
                    {!isPending && title !== "Language Change Requests" && (
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                        <span className={`
                          inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${item.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }
                        `}>
                          {item.status}
                        </span>
                      </td>
                    )}
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end">
                        {item.action}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <div className="text-zinc-400 text-sm">
              No {title.toLowerCase()} available at the moment
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTable;