import React from 'react';

function StepFinish() {
  return (
    <div className="w-full">
      <div className="border rounded-md w-full">
        <div className="bg-gray-200 p-2 font-bold text-center border-b font-inter text-2xl ">Summary</div>
        <table className="w-full text-left table-fixed">
          <tbody>
            <tr className="border-b">
              <td className="w-1/4 p-2 font-medium bg-gray-50 text-xl">Provider:</td>
              <td className="p-2">Connected</td>
            </tr>
            <tr className="border-b">
              <td className="w-1/4 p-2 font-medium bg-gray-50 text-xl ">Email:</td>
              <td className="p-2 text-grey-600">Error</td>
            </tr>
            <tr className="border-b">
              <td className="w-1/4 p-2 font-medium bg-gray-50">Folders:</td>
              <td className="p-2 text-grey-600">Pending</td>
            </tr>
            <tr>
              <td className="w-1/4 p-2 font-medium bg-gray-50 text-xl">Filters:</td>
              <td className="p-2 text-grey-600">Error</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StepFinish;

// 