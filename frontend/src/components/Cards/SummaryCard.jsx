import React from "react";
import { LuTrash2 } from "react-icons/lu";
import { getInitials } from "../../utils/helper";
const SummaryCard = ({
  
   colors,
   role,
   topicsToFocus,
   experience,
    questions,
    description,
    lastUpdated,
    onSelect,
    onDelete,
}) => {
    return (
       <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-rose-100 relative overflow-hidden"
       onClick={onSelect}
       >
         <div className="p-6 rounded-t-xl relative" style={{
           background:colors.bgcolor,
         }}
         >
           <div className="flex justify-between items-start">
             <div className="flex items-center">
               <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                   {getInitials(role)}
               </span>
             </div>
             {/* Content Container */}
             <div className="flex-1 ml-4">
               <div className="space-y-2">
                 {/*title and skills*/}
                 <div>
                   <h2 className="text-xl font-bold text-gray-800">{role}</h2>
                   <p className="text-gray-600 text-sm bg-white bg-opacity-80 px-3 py-1 rounded-lg inline-block shadow-sm">{topicsToFocus}</p>
                 </div>
               </div>
             </div>
           </div>
         
       
         <button className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition-colors shadow-md z-10" onClick={(e)=>{
           e.stopPropagation();
           onDelete();
         }}
         ><LuTrash2/></button>
         </div>
         <div className="p-6 bg-white rounded-b-xl">
           <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
             <div className="text-gray-600 bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-2 rounded-lg text-center border border-rose-100">
               Experience: {experience} {experience==1 ?"year":"years"}
             </div>
             <div className="text-gray-600 bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-2 rounded-lg text-center border border-rose-100">
               {questions} Q&A
             </div>
             <div className="text-gray-600 bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-2 rounded-lg text-center border border-rose-100">
               Last Updated: {lastUpdated}
             </div>
           </div>
           {/* Description */}
           <p className="text-gray-700 text-sm leading-relaxed bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-100">
             {description}
           </p>
         </div>
         </div>
  )
}
export default SummaryCard