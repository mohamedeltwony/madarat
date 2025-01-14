import React from "react";
import Link from "next/link";

export default function PageHeader({ tour }) {
  return (
    <div className="container">
      <div className="row justify-between py-30 mt-80">
        <div className="col-auto">
          <div className="text-14">
            <Link href="/" className="text-dark-1">Home</Link>
            <span className="text-light-1">{' > '}</span>
            <Link href="/tours" className="text-dark-1">Tours</Link>
            <span className="text-light-1">{' > '}</span>
            <span className="text-accent-1">{tour?.title || 'Tour Details'}</span>
          </div>
        </div>

        <div className="col-auto">
          <div className="text-14 text-light-1">
            {tour?.location || 'Tour Location'}
          </div>
        </div>
      </div>
    </div>
  );
}
