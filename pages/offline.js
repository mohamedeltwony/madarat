import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/pages/Offline.module.scss';
import Layout from '@/components/Layout';

export default function Offline() {
  return (
    <Layout>
      <Head>
        <title>غير متصل بالإنترنت - مدارات الكون</title>
        <meta name="description" content="أنت غير متصل بالإنترنت حالياً" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-8">
            <svg 
              className="mx-auto h-24 w-24 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" 
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            غير متصل بالإنترنت
          </h1>
          
          <p className="text-gray-600 mb-8">
            يبدو أنك غير متصل بالإنترنت حالياً. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة المحاولة
            </button>
            
            <button 
              onClick={() => window.history.back()} 
              className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              العودة للخلف
            </button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>نصائح لحل المشكلة:</p>
            <ul className="mt-2 space-y-1 text-right">
              <li>• تحقق من اتصال الواي فاي أو البيانات</li>
              <li>• تأكد من أن الإنترنت يعمل بشكل صحيح</li>
              <li>• جرب إعادة تشغيل المتصفح</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// This page should not be pre-rendered
export async function getServerSideProps() {
  return {
    props: {},
  };
}
