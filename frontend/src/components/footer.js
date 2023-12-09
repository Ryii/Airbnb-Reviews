import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';

export default function App() {
  return (
    <MDBFooter className='bg-dark text-center text-white'>
      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2023 Created by&nbsp;
        <a className='text-white' href='https://github.com/Ryii'>
          github.com/Ryii
        </a>
      </div>
    </MDBFooter>
  );
}