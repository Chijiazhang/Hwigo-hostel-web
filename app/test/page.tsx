export default function TestPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">测试页面</h1>
      <p className="text-lg text-gray-600">如果您能看到这个页面，说明Next.js正在正常工作。</p>
      <div className="mt-8 p-4 bg-blue-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">页面信息：</h2>
        <ul className="space-y-1">
          <li>• 页面路径: /test</li>
          <li>• 渲染时间: {new Date().toLocaleString()}</li>
          <li>• 状态: 正常</li>
        </ul>
      </div>
    </div>
  );
}






