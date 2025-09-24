const apiUrl = 'https://68d39c68214be68f8c667b34.mockapi.io/products';

async function fetchAndRenderTable() {
  const out = document.getElementById('output');
  const tbody = document.getElementById('tableBody');
  out.textContent = 'Đang tải dữ liệu...';
  tbody.innerHTML = '';
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Lỗi khi lấy dữ liệu: ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      data.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 transition-colors duration-150";
        tr.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.id}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.name}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$${item.price}</td>
          <td class="px-6 py-4 whitespace-nowrap img-cell">${item.image ? `<img src="${item.image}" alt="Ảnh sản phẩm" class="h-16 w-16 object-cover rounded-md shadow">` : 'N/A'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button data-id="${item.id}" class="delete-btn text-red-600 hover:text-red-900 transition-colors duration-200">Xoá</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      out.textContent = 'Đã tải xong!';
    } else {
      out.textContent = 'Không có sản phẩm nào.';
    }
  } catch (err) {
    out.textContent = 'Lỗi: ' + (err.message || err);
    console.error(err);
  }
}

async function addProduct(event) {
  event.preventDefault();
  const form = event.target;
  const newProduct = {
    name: form.productName.value,
    price: Number(form.productPrice.value),
    image: form.productImage.value
  };

  const out = document.getElementById('output');
  out.textContent = 'Đang thêm sản phẩm...';

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    });

    if (!res.ok) throw new Error(`Lỗi khi thêm sản phẩm: ${res.status} - ${await res.text()}`);

    out.textContent = 'Thêm sản phẩm thành công!';
    form.reset();
    fetchAndRenderTable();
  } catch (err) {
    out.textContent = 'Lỗi: ' + (err.message || err);
    console.error(err);
  }
}

async function deleteProduct(productId, btnElement) {
    const out = document.getElementById('output');
    out.textContent = `Đang xoá sản phẩm ID: ${productId}...`;

    try {
        const res = await fetch(`${apiUrl}/${productId}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error(`Lỗi khi xoá sản phẩm: ${res.status} - ${await res.text()}`);

        out.textContent = `Sản phẩm ID: ${productId} đã được xoá thành công!`;
        const tr = btnElement.closest('tr');
        if (tr) tr.remove();
    } catch (err) {
        out.textContent = 'Lỗi: ' + (err.message || err);
        console.error(err);
    }
}

window.addEventListener('DOMContentLoaded', fetchAndRenderTable);

document.getElementById('refreshBtn').addEventListener('click', fetchAndRenderTable);

document.getElementById('productForm').addEventListener('submit', addProduct);

document.getElementById('tableBody').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const productId = event.target.dataset.id;
        if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm có ID ${productId} không?`)) {
            deleteProduct(productId, event.target);
        }
    }
});