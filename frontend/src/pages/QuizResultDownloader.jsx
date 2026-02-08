// // QuizResultDownloader.jsx

// import React, { useState } from 'react';

// const QuizResultDownloader = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const handleDownload = async () => {
//         setIsLoading(true);
//         setError(null);
        
//         // ⚠️ ऑथेंटिकेशन टोकन प्राप्त करें (यह मानकर कि आप इसे localStorage में स्टोर करते हैं)
//         const authToken = localStorage.getItem('authToken'); 
        
//         if (!authToken) {
//             setError('Authentication token not found. Please log in again.');
//             setIsLoading(false);
//             return;
//         }

//         const downloadUrl = '/api/quizzes/download/results'; // आपका बैकएंड रूट

//         try {
//             const response = await fetch(downloadUrl, {
//                 method: 'GET',
//                 headers: {
//                     // टोकन को Authorization Header में भेजें
//                     'Authorization': `Bearer ${authToken}`, 
//                 },
//             });

//             if (response.ok) {
//                 // 1. Response को बाइनरी डेटा (Blob) के रूप में प्राप्त करें
//                 const blob = await response.blob();
                
//                 // 2. फ़ाइल डाउनलोड करने के लिए एक अस्थायी URL बनाएँ
//                 const url = window.URL.createObjectURL(blob);
                
//                 // 3. डाउनलोड शुरू करने के लिए एक अस्थायी <a> टैग बनाएँ
//                 const tempLink = document.createElement('a');
//                 tempLink.href = url;
//                 // फाइल का नाम सेट करें
//                 tempLink.setAttribute('download', 'quiz_results_data.csv'); 
                
//                 // 4. टैग को क्लिक करें और फिर हटा दें
//                 document.body.appendChild(tempLink);
//                 tempLink.click();
//                 document.body.removeChild(tempLink);
                
//                 // 5. अस्थायी URL को हटा दें
//                 window.URL.revokeObjectURL(url);
                
//                 console.log('Download initiated successfully.');

//             } else if (response.status === 403) {
//                 // 403 Forbidden: यदि यूजर फैकल्टी/एडमिन नहीं है
//                 const errorData = await response.json(); 
//                 setError(`Access Denied: ${errorData.message || 'You do not have permission to download this file.'}`);
//             } else if (response.status === 404) {
//                  // 404 Not Found: यदि CSV फाइल अभी तक नहीं बनी है
//                  setError('Results file not found. Have any quizzes been submitted yet?');
//             } else {
//                 setError(`Download failed with status: ${response.status}`);
//             }

//         } catch (err) {
//             console.error('Network or I/O error:', err);
//             setError('An error occurred while trying to download the file.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div style={styles.container}>
//             <h3>📋 क्विज़ परिणाम डाउनलोडर</h3>
//             <p>सभी क्विज़ सबमिशन डेटा को Excel-संगत CSV फ़ाइल में प्राप्त करें।</p>
            
//             <button 
//                 onClick={handleDownload} 
//                 disabled={isLoading}
//                 style={{...styles.button, opacity: isLoading ? 0.6 : 1}}
//             >
//                 {isLoading ? 'डाउनलोड हो रहा है...' : '⬇️ CSV फ़ाइल डाउनलोड करें'}
//             </button>
            
//             {error && <p style={styles.error}>{error}</p>}
//         </div>
//     );
// };

// // --- Basic Inline Styles (आप इसे अपनी CSS फ़ाइल से बदल सकते हैं) ---
// const styles = {
//     container: {
//         padding: '20px',
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         maxWidth: '400px',
//         margin: '20px 0',
//         backgroundColor: '#f9f9f9'
//     },
//     button: {
//         backgroundColor: '#28a745',
//         color: 'white',
//         padding: '10px 15px',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer',
//         fontSize: '16px',
//         marginTop: '10px',
//     },
//     error: {
//         color: 'red',
//         marginTop: '10px',
//         border: '1px solid #f5c6cb',
//         padding: '8px',
//         borderRadius: '4px',
//         backgroundColor: '#f8d7da'
//     }
// };

// export default QuizResultDownloader;