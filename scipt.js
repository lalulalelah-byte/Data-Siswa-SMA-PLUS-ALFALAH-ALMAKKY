/**
 * =====================================================================
 * SISTEM MANAJEMEN DATA SISWA SMA - JAVASCRIPT LOGIC
 * =====================================================================
 */

// Kunci unik untuk penyimpanan data di dalam LocalStorage browser
const STORAGE_KEY = "sma_students_data";

/**
 * 1. PENGELOLAAN DATA (LocalStorage)
 */

// Mengambil data siswa dari LocalStorage. 
// Jika data belum ada, fungsi ini akan menginisialisasi data awal (default).
function getStudents() {
    let data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        const defaultData = [
             { id: 1, nisn: "3098472186", nama: "Ainu Zahroh", kelas: "XII SASTRA B", jk: "Perempuan", alamat: "Jl. Pagedangan Kec.Turen Malang" },
             { id: 2, nisn: "0101337663", nama: "A.Zaidan Bahtiar", kelas: "XI SASTRA A", jk: "Laki-laki", alamat: "Jl. Sumber Duren Kec.Gedangan Malang" },
             { id: 3, nisn: "0116508654", nama: "Abay Amroe Rafael Hariono", kelas: "X A", jk: "Laki-laki", alamat: "Jl. KH.Ahmad Dahlan Kec.Gondanglegi Malang" },
             { id: 4, nisn: "3103575421", nama: "Abdul Aziz Alhamid", kelas: "X A", jk: "Laki-laki", alamat: "Jl.Krajan Kec.Gondanglegi Malang" },
             { id: 5, nisn: "3098084063", nama: "Abdul Ghofar Rozin", kelas: "XI SASTRA A", alamat: "Jl.Prangas Kec.Sumber Manjing Wetan Malang" },
             { id: 6, nisn: "0123968700", nama: "Abiel ALgafuri Firdaus", kelas: "X B", alamat: "Jl.Simpang Mataram Kec.Dampit Malang" },
             { id: 7, nisn: "0084029428", nama: "Aburizal Hafidz", kelas: "XII SASTRA A",  alamat: "JL.Raya Talangagung Kec.Kepanjen Malang" },
             { id: 8, nisn: "0117677439", nama: "Achmad Fardani", kelas: "X A", alamat: "Jl.Ngipik Kec.Pagelaran Malang" },
             { id: 9, nisn: "3110747945", nama: "Achmad Nurul Ula Alfarkhani", kelas: "X A", alamat: "Jl.Tangkil Sari Kec.Tajinan Malang" },
             { id: 10, nisn: "3099295117", nama: "Adinda Mutiara Hikmah", kelas: "X B", alamat: "Jl.Bachrowi Kec.Pagelaran Malang" },
             { id: 11, nisn: "0098385598", nama: "Adinda Nur Fadhilah", kelas: "XI B", alamat: "Jl.Kalianyar Kec.Kedungkandang Malang" },
             { id: 12, nisn: "3115449127", nama: "Ahmad Abu Sufyan Rojab Mubarok", kelas: "X A", alamat: "Jl.Urek Urek Kec.Gondanglegi Malang" },
             { id: 13, nisn: "3104559379", nama: "ahmad Ali Ridho Hamdani", kelas: "XI A", alamat: "Jl.Ngipek Kec.Pagelaran Malang" },
             { id: 14, nisn: "0096559941", nama: "Ahmad Mudzakkir", kelas: "XI A", alamat: "Jl.Jatikerto Kec.Kromengan Malang" },
             { id: 15, nisn: "0117395401", nama: "Ahmad Wildan Nasrullah", kelas: "X A", alamat: "Jl.Mbiru Kec.Singosari Malang" },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(data);
}

// Menyimpan array data siswa terbaru ke dalam LocalStorage
function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}


/**
 * 2. RENDER TABEL & STATISTIK
 */

// Merender atau memperbarui tampilan baris tabel HTML berdasarkan data
function renderTable(dataToRender) {
    const tbody = document.getElementById("student-table-body");
    const emptyState = document.getElementById("empty-state");
    
    // Kosongkan isi tabel terlebih dahulu sebelum diisi ulang
    tbody.innerHTML = "";

    // Periksa apakah data kosong
    if (dataToRender.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
        
        // Looping data siswa dan buat elemen baris tabel secara dinamis
        dataToRender.forEach((student, index) => {
            const tr = document.createElement("tr");
            tr.className = "hover:bg-slate-50 transition";
            tr.innerHTML = `
                <td class="py-3 px-4 text-slate-500">${index + 1}</td>
                <td class="py-3 px-4 font-mono text-slate-600">${student.nisn}</td>
                <td class="py-3 px-4 font-medium text-slate-900">${student.nama}</td>
                <td class="py-3 px-4">${student.kelas}</td>
                <td class="py-3 px-4">${student.jk}</td>
                <td class="py-3 px-4 text-center space-x-2">
                    <button onclick="viewDetail(${student.id})" class="text-emerald-600 hover:text-emerald-800 font-medium">Detail</button>
                    <button onclick="openModal('edit', ${student.id})" class="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                    <button onclick="deleteStudent(${student.id})" class="text-rose-600 hover:text-rose-800 font-medium">Hapus</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Perbarui kartu statistik setiap kali tabel dirender ulang
    updateStatistics();
}

// Memperbarui angka statistik di bagian atas dashboard
function updateStatistics() {
    const students = getStudents();
    const total = students.length;
    const lk = students.filter(s => s.jk === "Laki-laki").length;
    const pr = students.filter(s => s.jk === "Perempuan").length;

    document.getElementById("stat-total").innerText = total;
    document.getElementById("stat-lk").innerText = lk;
    document.getElementById("stat-pr").innerText = pr;
}


/**
 * 3. PENCARIAN & FILTER KELAS
 */

// Menyaring data siswa secara real-time berdasarkan input pencarian dan pilihan kelas
function filterData() {
    const searchKeyword = document.getElementById("search-input").value.toLowerCase();
    const selectedClass = document.getElementById("filter-kelas").value;
    const students = getStudents();

    const filtered = students.filter(student => {
        const matchSearch = student.nama.toLowerCase().includes(searchKeyword) || student.nisn.includes(searchKeyword);
        const matchClass = selectedClass === "" || student.kelas === selectedClass;
        return matchSearch && matchClass;
    });

    renderTable(filtered);
}


/**
 * 4. OPERASI CRUD (Tambah, Edit, Hapus) & MODAL
 */

// Membuka modal form (mode 'add' untuk tambah baru, 'edit' untuk ubah data)
function openModal(mode, id = null) {
    const modal = document.getElementById("student-modal");
    const modalTitle = document.getElementById("modal-title");
    const form = document.getElementById("student-form");
    
    // Reset form ke keadaan kosong
    form.reset();

    if (mode === 'add') {
        modalTitle.innerText = "Tambah Data Siswa";
        document.getElementById("student-id").value = "";
    } else if (mode === 'edit') {
        modalTitle.innerText = "Edit Data Siswa";
        const students = getStudents();
        const student = students.find(s => s.id === id);
        
        // Isi form dengan data siswa yang dipilih untuk diedit
        if (student) {
            document.getElementById("student-id").value = student.id;
            document.getElementById("nisn").value = student.nisn;
            document.getElementById("nama").value = student.nama;
            document.getElementById("kelas").value = student.kelas;
            document.getElementById("jk").value = student.jk;
            document.getElementById("alamat").value = student.alamat;
        }
    }
    modal.classList.remove("hidden");
}

// Menutup modal form input
function closeModal() {
    document.getElementById("student-modal").classList.add("hidden");
}

// Menyimpan data siswa (menangani penambahan baru atau pembaruan data lama)
function saveStudent(event) {
    event.preventDefault(); // Mencegah form melakukan reload halaman secara default
    
    const id = document.getElementById("student-id").value;
    const nisn = document.getElementById("nisn").value;
    const nama = document.getElementById("nama").value;
    const kelas = document.getElementById("kelas").value;
    const jk = document.getElementById("jk").value;
    const alamat = document.getElementById("alamat").value;

    let students = getStudents();

    if (id === "") {
        // Logika Tambah Data Baru (membuat ID unik baru)
        const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
        students.push({ id: newId, nisn, nama, kelas, jk, alamat });
    } else {
        // Logika Update Data Berdasarkan ID
        students = students.map(s => s.id == id ? { id: Number(id), nisn, nama, kelas, jk, alamat } : s);
    }

    saveStudents(students);
    closeModal();
    filterData();
}

// Menghapus data siswa dari LocalStorage berdasarkan ID
function deleteStudent(id) {
    if (confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) {
        let students = getStudents();
        students = students.filter(s => s.id !== id);
        saveStudents(students);
        filterData();
    }
}


/**
 * 5. FITUR DETAIL SISWA
 */

// Menampilkan modal informasi lengkap siswa berdasarkan ID
function viewDetail(id) {
    const students = getStudents();
    const student = students.find(s => s.id === id);
    
    if (student) {
        document.getElementById("detail-nisn").innerText = student.nisn;
        document.getElementById("detail-nama").innerText = student.nama;
        document.getElementById("detail-kelas").innerText = student.kelas;
        document.getElementById("detail-jk").innerText = student.jk;
        document.getElementById("detail-alamat").innerText = student.alamat;
        document.getElementById("detail-modal").classList.remove("hidden");
    }
}

// Menutup modal detail siswa
function closeDetailModal() {
    document.getElementById("detail-modal").classList.add("hidden");
}


/**
 * 6. EKSPOR DATA KE CSV
 */

// Mengunduh rekapitulasi data siswa ke dalam format file .csv
function exportToCSV() {
    const students = getStudents();
    if (students.length === 0) {
        alert("Tidak ada data untuk diekspor!");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,NISN,Nama Lengkap,Kelas,Jenis Kelamin,Alamat\r\n";
    students.forEach(s => {
        csvContent += `"${s.nisn}","${s.nama}","${s.kelas}","${s.jk}","${s.alamat}"\r\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_siswa_sma.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


/**
 * 7. INISIALISASI AWAL
 */

// Menjalankan fungsi render tabel otomatis begitu halaman web selesai dimuat
window.onload = function() {
    renderTable(getStudents());
};
