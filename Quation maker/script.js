document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('quotationDate').value = today;
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    document.getElementById('validUntil').value = validUntil.toISOString().split('T')[0];
    
    attachItemListeners();
    
    document.getElementById('discount').addEventListener('input', calculateTotal);
    document.getElementById('tax').addEventListener('input', calculateTotal);
});

function attachItemListeners() {
    document.querySelectorAll('.item-quantity, .item-price').forEach(input => {
        input.addEventListener('input', function() {
            updateItemAmount(this.closest('.item-row'));
            calculateTotal();
        });
    });
}

function updateItemAmount(row) {
    const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const amount = quantity * price;
    row.querySelector('.item-amount').textContent = '₹' + amount.toFixed(2);
}

function calculateTotal() {
    let subtotal = 0;
    
    document.querySelectorAll('.item-row').forEach(row => {
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        subtotal += quantity * price;
    });
    
    const discountPercent = parseFloat(document.getElementById('discount').value) || 0;
    const taxPercent = parseFloat(document.getElementById('tax').value) || 0;
    
    const discountAmount = (subtotal * discountPercent) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * taxPercent) / 100;
    const total = afterDiscount + taxAmount;
    
    document.getElementById('subtotal').textContent = '₹' + subtotal.toFixed(2);
    document.getElementById('discountPercent').textContent = discountPercent;
    document.getElementById('discountAmount').textContent = '₹' + discountAmount.toFixed(2);
    document.getElementById('taxPercent').textContent = taxPercent;
    document.getElementById('taxAmount').textContent = '₹' + taxAmount.toFixed(2);
    document.getElementById('totalAmount').textContent = '₹' + total.toFixed(2);
}

function addItem() {
    const container = document.getElementById('itemsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'item-row';
    newItem.innerHTML = `
        <input type="text" class="item-name" placeholder="Service/Item Name *" required>
        <textarea class="item-description" placeholder="Description" rows="2"></textarea>
        <input type="number" class="item-quantity" placeholder="Qty" value="1" min="1">
        <input type="number" class="item-price" placeholder="Price (₹)" min="0" step="0.01">
        <div class="item-amount">₹0.00</div>
        <button class="btn-remove" onclick="removeItem(this)">×</button>
    `;
    container.appendChild(newItem);
    attachItemListeners();
}

function removeItem(button) {
    if (document.querySelectorAll('.item-row').length > 1) {
        button.closest('.item-row').remove();
        calculateTotal();
    } else {
        alert('At least one item is required!');
    }
}

function previewQuotation() {
    if (!validateForm()) return;
    
    const preview = generatePreviewHTML();
    document.getElementById('previewContent').innerHTML = preview;
    document.getElementById('previewModal').style.display = 'block';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

function validateForm() {
    const clientName = document.getElementById('clientName').value.trim();
    const clientEmail = document.getElementById('clientEmail').value.trim();
    const quotationNumber = document.getElementById('quotationNumber').value.trim();
    
    if (!clientName || !clientEmail || !quotationNumber) {
        alert('Please fill in all required fields (marked with *)');
        return false;
    }
    
    const items = document.querySelectorAll('.item-row');
    for (let item of items) {
        const name = item.querySelector('.item-name').value.trim();
        if (!name) {
            alert('Please fill in all item names');
            return false;
        }
    }
    
    return true;
}

function generatePreviewHTML() {
    const clientName = document.getElementById('clientName').value;
    const clientCompany = document.getElementById('clientCompany').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const clientAddress = document.getElementById('clientAddress').value;
    
    const quotationNumber = document.getElementById('quotationNumber').value;
    const quotationDate = document.getElementById('quotationDate').value;
    const validUntil = document.getElementById('validUntil').value;
    
    const terms = document.getElementById('terms').value;
    const notes = document.getElementById('notes').value;
    
    let itemsHTML = '';
    document.querySelectorAll('.item-row').forEach((row, index) => {
        const name = row.querySelector('.item-name').value;
        const description = row.querySelector('.item-description').value;
        const quantity = row.querySelector('.item-quantity').value;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const amount = quantity * price;
        
        itemsHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>
                    <strong>${name}</strong>
                    ${description ? '<br><small>' + description + '</small>' : ''}
                </td>
                <td>${quantity}</td>
                <td>₹${price.toFixed(2)}</td>
                <td><strong>₹${amount.toFixed(2)}</strong></td>
            </tr>
        `;
    });
    
    const subtotal = document.getElementById('subtotal').textContent;
    const discountPercent = document.getElementById('discountPercent').textContent;
    const discountAmount = document.getElementById('discountAmount').textContent;
    const taxPercent = document.getElementById('taxPercent').textContent;
    const taxAmount = document.getElementById('taxAmount').textContent;
    const totalAmount = document.getElementById('totalAmount').textContent;
    
    return `
        <div class="preview-header">
            <div>
                <img src="../logo.png" alt="AYPTech" class="preview-logo">
            </div>
            <div class="preview-company">
                <h2>AYPTech</h2>
                <p>Shri Krishna Society, Near Abhang Nagari, Dehugaon<br>
                Tal. Haveli, Pune, Maharashtra – 412109<br>
                Phone: +91 9175362929<br>
                Email: contact@ayptech.com</p>
            </div>
        </div>
        
        <h1 class="preview-title">QUOTATION</h1>
        
        <div class="preview-grid">
            <div class="preview-section">
                <h3>Bill To:</h3>
                <div class="preview-item">
                    <strong>${clientName}</strong><br>
                    ${clientCompany ? clientCompany + '<br>' : ''}
                    ${clientEmail}<br>
                    ${clientPhone ? clientPhone + '<br>' : ''}
                    ${clientAddress ? clientAddress : ''}
                </div>
            </div>
            <div class="preview-section">
                <h3>Quotation Details:</h3>
                <div class="preview-item">
                    <strong>Quotation #:</strong> ${quotationNumber}<br>
                    <strong>Date:</strong> ${quotationDate}<br>
                    <strong>Valid Until:</strong> ${validUntil}
                </div>
            </div>
        </div>
        
        <table class="preview-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Item/Service</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>
        
        <div class="preview-summary">
            <div class="preview-summary-row">
                <span>Subtotal:</span>
                <span>${subtotal}</span>
            </div>
            <div class="preview-summary-row">
                <span>Discount (${discountPercent}%):</span>
                <span>${discountAmount}</span>
            </div>
            <div class="preview-summary-row">
                <span>Tax/GST (${taxPercent}%):</span>
                <span>${taxAmount}</span>
            </div>
            <div class="preview-summary-row preview-total">
                <span>Total:</span>
                <span>${totalAmount}</span>
            </div>
        </div>
        
        ${terms ? `
        <div class="preview-section">
            <h3>Terms & Conditions:</h3>
            <div class="preview-item">
                ${terms.replace(/\n/g, '<br>')}
            </div>
        </div>
        ` : ''}
        
        ${notes ? `
        <div class="preview-section">
            <h3>Additional Notes:</h3>
            <div class="preview-item">
                ${notes.replace(/\n/g, '<br>')}
            </div>
        </div>
        ` : ''}
        
        <div style="margin-top: 40px; text-align: center; color: #666;">
            <p>Thank you for your business!</p>
        </div>
    `;
}

async function generatePDF() {
    if (!validateForm()) return;
    
    // Check if libraries are loaded
    if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
        alert('PDF libraries are still loading. Please wait a moment and try again.');
        return;
    }
    
    const preview = generatePreviewHTML();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = preview;
    tempDiv.style.cssText = `
        padding: 40px;
        background: white;
        color: #333;
        width: 800px;
        position: absolute;
        left: -9999px;
        top: 0;
        font-family: Arial, sans-serif;
        line-height: 1.4;
    `;
    document.body.appendChild(tempDiv);
    
    try {
        // Wait a bit for rendering
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(tempDiv, {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: 800,
            height: tempDiv.scrollHeight
        });
        
        const imgData = canvas.toDataURL('image/png', 0.95);
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const pdfWidth = 210;
        const pdfHeight = 297;
        const imgWidth = pdfWidth - 20; // 10mm margin on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 10; // 10mm top margin
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20); // Account for margins
        
        // Add additional pages if needed
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 20);
        }
        
        const quotationNumber = document.getElementById('quotationNumber').value;
        pdf.save(`AYPTech_Quotation_${quotationNumber}.pdf`);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF: ' + error.message + '. Please try the Preview option instead.');
    } finally {
        if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
        }
    }
}

function resetForm() {
    if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
        localStorage.removeItem('ayptech_quotation');
        location.reload();
    }
}

// Simple PDF alternative - opens in new window for easy saving
function downloadAsHTML() {
    if (!validateForm()) return;
    
    const preview = generatePreviewHTML();
    const newWindow = window.open('', '_blank');
    
    newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>AYPTech Quotation - ${document.getElementById('quotationNumber').value}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    color: #333;
                    background: white;
                    line-height: 1.4;
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
                .action-buttons {
                    text-align: center;
                    margin: 30px 0;
                    padding: 20px;
                    background: #f0f0f0;
                    border-radius: 10px;
                }
                .btn {
                    padding: 12px 24px;
                    margin: 0 10px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                }
                .btn-primary { background: #CD7F32; color: white; }
                .btn-secondary { background: #E1C16E; color: #000; }
                @media print {
                    .action-buttons { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="window.print()">🖨️ Print / Save as PDF</button>
                <button class="btn btn-secondary" onclick="window.close()">❌ Close</button>
                <p><small>Use Ctrl+P or Cmd+P to print. In print dialog, choose "Save as PDF" to download.</small></p>
            </div>
            ${preview}
        </body>
        </html>
    `);
    
    newWindow.document.close();
    newWindow.focus();
}

function saveFormData() {
    const formData = {
        clientName: document.getElementById('clientName').value,
        clientCompany: document.getElementById('clientCompany').value,
        clientEmail: document.getElementById('clientEmail').value,
        clientPhone: document.getElementById('clientPhone').value,
        clientAddress: document.getElementById('clientAddress').value,
        quotationNumber: document.getElementById('quotationNumber').value,
        quotationDate: document.getElementById('quotationDate').value,
        validUntil: document.getElementById('validUntil').value,
        discount: document.getElementById('discount').value,
        tax: document.getElementById('tax').value,
        terms: document.getElementById('terms').value,
        notes: document.getElementById('notes').value,
        items: []
    };
    
    document.querySelectorAll('.item-row').forEach(row => {
        formData.items.push({
            name: row.querySelector('.item-name').value,
            description: row.querySelector('.item-description').value,
            quantity: row.querySelector('.item-quantity').value,
            price: row.querySelector('.item-price').value
        });
    });
    
    localStorage.setItem('ayptech_quotation', JSON.stringify(formData));
}

function loadFormData() {
    const saved = localStorage.getItem('ayptech_quotation');
    if (!saved) return;
    
    try {
        const formData = JSON.parse(saved);
        
        document.getElementById('clientName').value = formData.clientName || '';
        document.getElementById('clientCompany').value = formData.clientCompany || '';
        document.getElementById('clientEmail').value = formData.clientEmail || '';
        document.getElementById('clientPhone').value = formData.clientPhone || '';
        document.getElementById('clientAddress').value = formData.clientAddress || '';
        document.getElementById('quotationNumber').value = formData.quotationNumber || 'QT-001';
        document.getElementById('quotationDate').value = formData.quotationDate || '';
        document.getElementById('validUntil').value = formData.validUntil || '';
        document.getElementById('discount').value = formData.discount || '0';
        document.getElementById('tax').value = formData.tax || '18';
        document.getElementById('terms').value = formData.terms || '';
        document.getElementById('notes').value = formData.notes || '';
        
        if (formData.items && formData.items.length > 0) {
            const container = document.getElementById('itemsContainer');
            container.innerHTML = '';
            
            formData.items.forEach(item => {
                const newItem = document.createElement('div');
                newItem.className = 'item-row';
                newItem.innerHTML = `
                    <input type="text" class="item-name" placeholder="Service/Item Name *" value="${item.name}" required>
                    <textarea class="item-description" placeholder="Description" rows="2">${item.description}</textarea>
                    <input type="number" class="item-quantity" placeholder="Qty" value="${item.quantity}" min="1">
                    <input type="number" class="item-price" placeholder="Price (₹)" value="${item.price}" min="0" step="0.01">
                    <div class="item-amount">₹0.00</div>
                    <button class="btn-remove" onclick="removeItem(this)">×</button>
                `;
                container.appendChild(newItem);
            });
            
            attachItemListeners();
            calculateTotal();
        }
    } catch (e) {
        console.log('Error loading saved data:', e);
    }
}

function testFill() {
    // Fill client details
    document.getElementById('clientName').value = 'Ameet Anand Kakde';
    document.getElementById('clientCompany').value = 'OOPL Group';
    document.getElementById('clientEmail').value = 'hrpune@omkargroupindia.com';
    document.getElementById('clientPhone').value = '9011837681';
    document.getElementById('clientAddress').value = 'Reg. Office 73 B wing Jai ganesh akurdi Pune 411035';
    
    // Fill quotation details
    document.getElementById('quotationNumber').value = 'QT-001';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('quotationDate').value = today;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    document.getElementById('validUntil').value = validUntil.toISOString().split('T')[0];
    
    // Clear existing items and add test items
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';
    
    // Add test items
    const testItems = [
        {
            name: 'App Development',
            description: 'Employee Login\nLocation Tracking\nAttendance Management\nPunch In / Punch Out\nSalary Overview',
            quantity: '1',
            price: '80000'
        },
        {
            name: 'Web-App Development',
            description: 'Admin Dashboard\nHR Analytics\nEmployee Management\nAttendance Monitoring\nSystem Controls',
            quantity: '1',
            price: '45000'
        },
        {
            name: 'Maintenance',
            description: 'Server Monitoring\nBug Fixes\nMinor Updates',
            quantity: '1',
            price: '30000'
        }
    ];
    
    testItems.forEach(item => {
        const newItem = document.createElement('div');
        newItem.className = 'item-row';
        newItem.innerHTML = `
            <input type="text" class="item-name" placeholder="Service/Item Name *" value="${item.name}" required>
            <textarea class="item-description" placeholder="Description" rows="2">${item.description}</textarea>
            <input type="number" class="item-quantity" placeholder="Qty" value="${item.quantity}" min="1">
            <input type="number" class="item-price" placeholder="Price (₹)" value="${item.price}" min="0" step="0.01">
            <div class="item-amount">₹0.00</div>
            <button class="btn-remove" onclick="removeItem(this)">×</button>
        `;
        container.appendChild(newItem);
    });
    
    // Fill additional details
    document.getElementById('discount').value = '0';
    document.getElementById('tax').value = '18';
    document.getElementById('terms').value = '1. Payment terms: 50% advance, 50% on completion\n2. Validity: 30 days from quotation date\n3. Prices are subject to change without notice';
    document.getElementById('notes').value = 'Thank you for choosing AYPTech for your digital transformation needs.';
    
    // Attach listeners and calculate
    attachItemListeners();
    calculateTotal();
    saveFormData();
    
    alert('✅ Test data filled successfully!');
}

window.onclick = function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target == modal) {
        closePreview();
    }
}
