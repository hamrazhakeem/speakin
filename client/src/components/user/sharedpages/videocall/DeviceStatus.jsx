const DeviceStatus = ({ icon: Icon, label, status }) => {
    const getStatusColor = (status) => ({
      ready: 'text-green-500',
      error: 'text-red-500',
      checking: 'text-yellow-500'
    }[status] || 'text-yellow-500');
  
    const getStatusText = (status) => ({
      ready: 'Ready',
      error: 'Error',
      checking: 'Checking...'
    }[status]);
  
    return (
      <div className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors duration-200">
        <Icon className={`w-5 h-5 ${getStatusColor(status)}`} />
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`ml-auto text-sm font-medium ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </span>
      </div>
    );
  };

  export default DeviceStatus