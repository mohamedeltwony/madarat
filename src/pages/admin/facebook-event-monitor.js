import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function FacebookEventMonitor() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data from the validation endpoint
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/validate-events');
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching Facebook event validation:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper to format timestamp
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Facebook Event Health Monitor | Madarat Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <h1 className="text-2xl font-bold mb-6">Facebook Event Health Monitor</h1>
      
      <div className="mb-4">
        <button 
          onClick={fetchData}
          disabled={refreshing}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Connection Status */}
            <div className={`p-4 rounded shadow-sm ${data.connection.success ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 className="font-bold">Connection Status</h3>
              <p>{data.connection.message}</p>
              {data.connection.success && (
                <p className="text-sm mt-2">
                  Pixel ID: {data.connection.pixelId}<br />
                  Pixel Name: {data.connection.pixelName}
                </p>
              )}
            </div>
            
            {/* Configuration */}
            <div className="p-4 rounded shadow-sm bg-blue-50">
              <h3 className="font-bold">Configuration</h3>
              <ul className="mt-2">
                <li>
                  Pixel: {data.configuredServices.pixel ? 
                    <span className="text-green-600">✓</span> : 
                    <span className="text-red-600">✗</span>}
                </li>
                <li>
                  Conversion API: {data.configuredServices.capi ? 
                    <span className="text-green-600">✓</span> : 
                    <span className="text-red-600">✗</span>}
                </li>
                <li>
                  Test Events: {data.configuredServices.test_events ? 
                    <span className="text-green-600">✓</span> : 
                    <span className="text-red-600">✗</span>}
                </li>
              </ul>
            </div>
            
            {/* Health Summary */}
            <div className={`p-4 rounded shadow-sm ${
              data.diagnostics?.hasCriticalIssues ? 'bg-red-100' : 
              data.diagnostics?.count > 0 ? 'bg-yellow-100' :
              'bg-green-100'
            }`}>
              <h3 className="font-bold">Event Health</h3>
              {data.diagnostics ? (
                <div>
                  <p>{data.diagnostics.count} diagnostic issues found</p>
                  {data.diagnostics.hasCriticalIssues && (
                    <p className="text-red-600 font-bold">Critical issues detected!</p>
                  )}
                </div>
              ) : (
                <p>Diagnostics unavailable</p>
              )}
            </div>
          </div>
          
          {/* Diagnostics Table */}
          {data.diagnostics?.diagnostics?.length > 0 && (
            <div className="overflow-x-auto">
              <h3 className="font-bold text-xl mb-3">Event Diagnostics</h3>
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Event</th>
                    <th className="py-2 px-4 border-b">Type</th>
                    <th className="py-2 px-4 border-b">Severity</th>
                    <th className="py-2 px-4 border-b">Message</th>
                    <th className="py-2 px-4 border-b">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.diagnostics.diagnostics.map((issue, index) => (
                    <tr key={index} className={issue.severityLevel === 'CRITICAL' ? 'bg-red-50' : ''}>
                      <td className="py-2 px-4 border-b">{issue.eventName}</td>
                      <td className="py-2 px-4 border-b">{issue.diagnosticType}</td>
                      <td className="py-2 px-4 border-b">{issue.severityLevel}</td>
                      <td className="py-2 px-4 border-b">{issue.message}</td>
                      <td className="py-2 px-4 border-b">{formatTime(issue.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Last updated */}
          <div className="mt-6 text-gray-500 text-sm">
            Last updated: {formatTime(data.timestamp)}
          </div>
        </div>
      )}
      
      {/* Recommendations */}
      <div className="mt-10 bg-gray-50 p-4 rounded">
        <h3 className="font-bold text-xl mb-3">Tips for 10/10 Event Quality Score</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Ensure both Pixel and Conversion API events are sent (redundancy)</li>
          <li>Use the same event_id for client and server events (deduplication)</li>
          <li>Include all customer information parameters: email, phone, name, address</li>
          <li>Always hash PII data according to Facebook requirements</li>
          <li>Include as many customer parameters as possible for better matching</li>
          <li>Use external_id to track users across sessions</li>
          <li>Include fbp and fbc browser parameters</li>
          <li>Track offline conversions (e.g., phone calls) with the Offline Conversion API</li>
          <li>Verify your domain in Facebook Business Manager</li>
          <li>Keep your Meta Pixel implemented in the standard way (avoid lazy loading)</li>
        </ol>
      </div>
    </div>
  );
} 