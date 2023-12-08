function validateSku(input) {
    var pattern = /^[A-Za-z0-9]{13}$/; // 13桁の半角英数字
    var isValid = pattern.test(input.value);

    var errorDiv = input.parentElement.querySelector('.error-message');

    if (isValid) {
        errorDiv.textContent = ''; // Clear the error message
    } else {
        errorDiv.textContent = '※13桁の半角英数字を入力してください';
    }
}

function validateNumber(input) {
    var pattern = /^\d*$/; // 数字のみ
    var isValid = pattern.test(input.value);

    var errorDiv = input.parentElement.querySelector('.error-message2');

    if (isValid) {
        errorDiv.textContent = ''; // Clear the error message
    } else {
        errorDiv.textContent = '※数字を入力してください';
        input.value = input.value.replace(/[^\d]/g, ''); // 非数字を削除
    }
}

function addRow() {
    // Create a new div element
    var newRow = document.createElement("div");
    newRow.classList.add("input-row");
    // Set the HTML content of the new row with input fields
    newRow.innerHTML = `
        <div class="form_box">
            <label for="sku"></label>
            <input type="text" maxlength="13" class="sku" placeholder="" required oninput="validateSku(this)><br>
            <div class="error-message"></div>
        </div>
        
        <div class="form_box">   
            <label for="cost"></label>
            <input type="text" inputmode=”numeric” class="cost" required oninput="validateNumber(this)><br>
            <div class="error-message2"></div>
        </div>
        <div class="form_box">    
            <label for="sellingPrice"></label>
            <input type="text" inputmode=”numeric” class="sellingPrice" required oninput="validateNumber(this)><br>
            <div class="error-message2"></div>
        </div>
        <div class="form_box">    
            <label for="startDate"></label>
            <input type="date" class="startDate" required><br>
        </div>
    `;
    var deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-row-button");
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", function () {
        deleteRow(newRow);
    });
    newRow.appendChild(deleteButton);
    var lastInputRow = document.querySelector("#priceForm .input-row:last-child");
    if (lastInputRow) {
        lastInputRow.parentNode.insertBefore(newRow, lastInputRow.nextSibling);
    } else {
        document.getElementById("priceForm").insertBefore(newRow, document.getElementById("priceForm").lastElementChild.previousElementSibling);
    }
}

function deleteRow(row) {
    row.parentNode.removeChild(row);

}

function resetForm() {
    // ページをリダイレクト
    window.location.href = window.location.href;
}

function generateCSV() {
    // Collect values from existing and dynamically created input fields
    var rows = document.querySelectorAll("#priceForm .input-row");
    var csvContent = "\uFEFF商品,原価単価,税抜購買単価,税抜上代単価,税抜販売単価,適用開始日,商品名,税込購買単価,税込上代単価,税込販売単価\n";
    rows.forEach(function (row) {
        var sku = row.querySelector(".sku").value;
        var cost = row.querySelector(".cost").value;
        var sellingPrice = row.querySelector(".sellingPrice").value;
        var startDate = row.querySelector(".startDate").value;
    
        // Format the date as a plain string without hyphens (remove the time portion)
        var formattedDate = new Date(startDate);
        formattedDate.setHours(0, 0, 0, 0);
        var dateStringWithoutHyphens = formattedDate.toISOString().split("T")[0].replace(/-/g, '');
    
        // Append values to CSV content
        csvContent += `${sku},${cost},${cost},${sellingPrice},${sellingPrice},${dateStringWithoutHyphens}\n`;
    });
        
    // 現在の日時を取得
    var now = new Date();
    var timestamp = now.toISOString().replace(/[^0-9]/g, '');
        
    // ファイル名に日時を組み込んで保存
    var fileName = "商品単価マスタ_" + timestamp + ".csv";
        
    // Create a data URI and trigger a download
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", "data:text/csv;charset=utf-8," + encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
}
