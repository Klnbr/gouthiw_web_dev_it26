import React from 'react'
import '.././App.css'

function IngrScreen() {
     const handleAddIngr = () => {
          alert("เพิ่ม")
     }
     return (
          <div>
               <button onClick={() => handleAddIngr()}>เพิ่มวัตถุดิบ</button>
               <table className='table-ingr'>
                    <tr>
                         <th>ชื่อวัตถุดิบ</th>
                         <th>ค่าพิวรีน (โดยเฉลี่ย)</th>
                         <th>ค่ากรดยูริก (โดยเฉลี่ย)</th>
                    </tr>
                    <tr>
                         <th>ชื่อวัตถุดิบ</th>
                         <th>ค่าพิวรีน (โดยเฉลี่ย)</th>
                         <th>ค่ากรดยูริก (โดยเฉลี่ย)</th>
                    </tr>
                    <tr>
                         <th>ชื่อวัตถุดิบ</th>
                         <th>ค่าพิวรีน (โดยเฉลี่ย)</th>
                         <th>ค่ากรดยูริก (โดยเฉลี่ย)</th>
                    </tr>
                    <tr>
                         <th>ชื่อวัตถุดิบ</th>
                         <th>ค่าพิวรีน (โดยเฉลี่ย)</th>
                         <th>ค่ากรดยูริก (โดยเฉลี่ย)</th>
                    </tr>
                    <tr>
                         <th>ชื่อวัตถุดิบ</th>
                         <th>ค่าพิวรีน (โดยเฉลี่ย)</th>
                         <th>ค่ากรดยูริก (โดยเฉลี่ย)</th>
                    </tr>
               </table>
          </div>
     )
}

export default IngrScreen