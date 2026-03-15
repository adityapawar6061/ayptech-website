function printQuotation() {
    if (!validateForm()) return;
    
    const preview = generatePreviewHTML();
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>AYPTech Quotation</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    color: #333;
                    background: white;
                }
                .preview-header { 
                    display: flex; 
                    justify-content: space-between; 
                    margin-bottom: 30px; 
                    padding-bottom: 20px; 
                    border-bottom: 2px solid #333; 
                }
                .preview-logo { height: 60px; }
                .preview-company { text-align: right; }
                .preview-company h2 { color: #CD7F32; margin-bottom: 10px; }
                .preview-title { 
                    text-align: center; 
                    font-size: 32px; 
                    color: #CD7F32; 
                    margin: 30px 0; 
                }
                .preview-grid { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 20px; 
                    margin-bottom: 20px; 
                }
                .preview-section h3 { color: #E1C16E; margin-bottom: 10px; }
                .preview-item { 
                    padding: 10px; 
                    background: #EADDCA; 
                    border-radius: 5px; 
                }
                .preview-table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 20px 0; 
                }
                .preview-table th { 
                    background: #CD7F32; 
                    color: white; 
                    padding: 12px; 
                    text-align: left; 
                }
                .preview-table td { 
                    padding: 12px; 
                    border-bottom: 1px solid #ddd; 
                }
                .preview-table tr:nth-child(even) { background: #f9f9f9; }
                .preview-summary { 
                    margin-left: auto; 
                    width: 300px; 
                    margin-top: 20px; 
                }
                .preview-summary-row { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 8px 0; 
                }
                .preview-total { 
                    border-top: 2px solid #CD7F32; 
                    margin-top: 10px; 
                    padding-top: 10px; 
                    font-size: 20px; 
                    font-weight: bold; 
                    color: #CD7F32; 
                }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            ${preview}
            <div class="no-print" style="text-align: center; margin-top: 30px;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #CD7F32; color: white; border: none; border-radius: 5px; cursor: pointer;">Print / Save as PDF</button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #E1C16E; color: #000; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
}

// Add this function to the existing script