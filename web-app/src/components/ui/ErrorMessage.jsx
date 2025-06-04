import React from 'react';
import Link from 'next/link';

const ErrorMessage = ({ message, returnLink, returnText }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <p>{message}</p>
      {returnLink && (
        <Link
          href={returnLink}
          className="mt-2 inline-block text-sm font-medium text-red-700 underline"
        >
          {returnText || 'Retour'}
        </Link>
      )}
    </div>
  );
};

export default ErrorMessage;