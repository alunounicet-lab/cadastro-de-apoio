let pessoas = [
    { id: 1, ordem: 1, nome: "LUIZ EDUARDO", dias: "Quarta-feira, Sexta-feira, Sábado", turnos: "Noite" },
    { id: 2, ordem: 2, nome: "FRANCISCA MARIA FERREIRA E SILVA", dias: "Sexta-feira", turnos: "Tarde, Noite" },
    { id: 3, ordem: 4, nome: "LUIZ GUILHERME DANTAS", dias: "Quarta-feira, Quinta-feira", turnos: "Noite" },
    { id: 4, ordem: 7, nome: "INÁCIO PEREIRA DOS SANTOS", dias: "Quarta-feira, Quinta-feira", turnos: "Noite" },
    { id: 5, ordem: 8, nome: "FRANCISCO HARLEM NORONHA RIBEIRO", dias: "Quarta-feira, Quinta-feira", turnos: "Noite" },
    { id: 6, ordem: 9, nome: "ANTONIO EDIVAN DA SILVA DO NASCIMENTO", dias: "Sexta-feira", turnos: "Tarde, Noite" },
    { id: 7, ordem: 10, nome: "ERIKA RAPHAELLA DE CASTRO ALVES DA SILVA", dias: "Quarta-feira, Quinta-feira, Sexta-feira", turnos: "Noite" },
    { id: 8, ordem: 11, nome: "LIDIARA RODRIGUES LIMA", dias: "Quarta-feira, Quinta-feira", turnos: "Noite" },
    { id: 9, ordem: 11, nome: "LIDIARA RODRIGUES LIMA", dias: "Sexta-feira", turnos: "Tarde, Noite" },
    { id: 10, ordem: 11, nome: "LIDIARA RODRIGUES LIMA", dias: "Sábado", turnos: "Manhã, Tarde" },
    { id: 11, ordem: 12, nome: "SARA VITORIA DO NASCIMENTO LIRA", dias: "Quarta-feira, Quinta-feira", turnos: "Tarde, Noite" },
    { id: 12, ordem: 13, nome: "KLEITON JOSE", dias: "Quarta-feira", turnos: "Noite" },
];

let editingId = null;

// ============================================
// ELEMENTOS DO DOM
// ============================================

const searchInput = document.getElementById('searchInput');
const newRecordBtn = document.getElementById('newRecordBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const printBtn = document.getElementById('printBtn');
const tableBody = document.getElementById('tableBody');
const recordCount = document.getElementById('recordCount');
const modal = document.getElementById('recordModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const submitBtn = document.getElementById('submitBtn');
const recordForm = document.getElementById('recordForm');
const modalTitle = document.getElementById('modalTitle');
const ordemInput = document.getElementById('ordem');
const nomeInput = document.getElementById('nome');
const diasInput = document.getElementById('dias');
const turnosInput = document.getElementById('turnos');
const toast = document.getElementById('toast');
const emptyState = document.getElementById('emptyState');

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Exibe uma notificação toast
 */
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Abre o modal
 */
function openModal(title = 'Novo Registro') {
    modalTitle.textContent = title;
    recordForm.reset();
    editingId = null;
    modal.classList.add('active');
}

/**
 * Fecha o modal
 */
function closeModal() {
    modal.classList.remove('active');
    recordForm.reset();
    editingId = null;
}

/**
 * Atualiza o contador de registros
 */
function updateRecordCount(count) {
    recordCount.textContent = `${count} ${count === 1 ? 'registro' : 'registros'}`;
}

/**
 * Filtra pessoas baseado na busca
 */
function getFilteredPessoas() {
    const searchTerm = searchInput.value.toLowerCase();
    return pessoas.filter(p =>
        p.nome.toLowerCase().includes(searchTerm) ||
        p.ordem.toString().includes(searchTerm)
    );
}

/**
 * Renderiza a tabela
 */
function renderTable() {
    const filtered = getFilteredPessoas();
    tableBody.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    filtered.forEach((pessoa, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = index % 2 === 0 ? '' : 'var(--color-secondary)';
        
        row.innerHTML = `
            <td>${pessoa.ordem}</td>
            <td>${pessoa.nome}</td>
            <td>${pessoa.dias}</td>
            <td>${pessoa.turnos}</td>
            <td class="text-center">
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editPessoa(${pessoa.id})" title="Editar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="action-btn delete" onclick="deletePessoa(${pessoa.id})" title="Deletar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });

    updateRecordCount(filtered.length);
}

/**
 * Adiciona ou atualiza uma pessoa
 */
function savePessoa() {
    const ordem = parseInt(ordemInput.value);
    const nome = nomeInput.value.trim();
    const dias = diasInput.value.trim();
    const turnos = turnosInput.value.trim();

    if (!ordem || !nome) {
        showToast('Preencha todos os campos obrigatórios', 'error');
        return;
    }

    if (editingId) {
        // Atualizar
        const index = pessoas.findIndex(p => p.id === editingId);
        if (index !== -1) {
            pessoas[index] = { ...pessoas[index], ordem, nome, dias, turnos };
            showToast('Registro atualizado com sucesso');
        }
    } else {
        // Adicionar novo
        const newId = Math.max(...pessoas.map(p => p.id), 0) + 1;
        pessoas.push({ id: newId, ordem, nome, dias, turnos });
        showToast('Registro adicionado com sucesso');
    }

    closeModal();
    renderTable();
}

/**
 * Edita uma pessoa
 */
function editPessoa(id) {
    const pessoa = pessoas.find(p => p.id === id);
    if (!pessoa) return;

    ordemInput.value = pessoa.ordem;
    nomeInput.value = pessoa.nome;
    diasInput.value = pessoa.dias;
    turnosInput.value = pessoa.turnos;
    editingId = id;

    openModal('Editar Registro');
}

/**
 * Deleta uma pessoa
 */
function deletePessoa(id) {
    if (confirm('Tem certeza que deseja remover este registro?')) {
        pessoas = pessoas.filter(p => p.id !== id);
        showToast('Registro removido com sucesso');
        renderTable();
    }
}

// ============================================
// EXPORTAÇÃO PARA EXCEL
// ============================================

function exportToExcel() {
    const filtered = getFilteredPessoas();
    
    if (filtered.length === 0) {
        showToast('Nenhum registro para exportar', 'error');
        return;
    }

    // Criar CSV
    let csv = 'Ordem,Nome,Dia(s),Turno(s)\n';
    filtered.forEach(p => {
        csv += `${p.ordem},"${p.nome}","${p.dias}","${p.turnos}"\n`;
    });

    // Criar blob e download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `cadastro-pessoas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Arquivo Excel exportado com sucesso');
}

// ============================================
// EXPORTAÇÃO PARA PDF
// ============================================

function exportToPDF() {
    const filtered = getFilteredPessoas();
    
    if (filtered.length === 0) {
        showToast('Nenhum registro para exportar', 'error');
        return;
    }

    // Criar HTML para PDF
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Listagem de Apoio</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #1e3a8a; margin-bottom: 5px; }
                .date { text-align: center; color: #666; margin-bottom: 20px; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; }
                th { background-color: #1e3a8a; color: white; padding: 10px; text-align: left; font-weight: bold; }
                td { padding: 8px; border-bottom: 1px solid #ddd; }
                tr:nth-child(even) { background-color: #f5f5f5; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <h1>Listagem de Apoio</h1>
            <p class="date">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
            <table>
                <thead>
                    <tr>
                        <th>Ordem</th>
                        <th>Nome</th>
                        <th>Dia(s)</th>
                        <th>Turno(s)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    filtered.forEach(p => {
        html += `
            <tr>
                <td>${p.ordem}</td>
                <td>${p.nome}</td>
                <td>${p.dias}</td>
                <td>${p.turnos}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;

    // Criar blob e download
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `cadastro-pessoas-${new Date().toISOString().split('T')[0]}.html`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('PDF exportado com sucesso');
}

// ============================================
// IMPRESSÃO
// ============================================

function printReport() {
    const filtered = getFilteredPessoas();
    
    if (filtered.length === 0) {
        showToast('Nenhum registro para imprimir', 'error');
        return;
    }

    const printWindow = window.open('', '', 'height=600,width=800');
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Listagem de Apoio</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; color: #1e3a8a; margin-bottom: 5px; }
                .date { text-align: center; color: #666; margin-bottom: 20px; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; }
                th { background-color: #1e3a8a; color: white; padding: 10px; text-align: left; font-weight: bold; }
                td { padding: 8px; border-bottom: 1px solid #ddd; }
                tr:nth-child(even) { background-color: #f5f5f5; }
                @media print { body { margin: 0; } }
            </style>
        </head>
        <body>
            <h1>Listagem de Apoio</h1>
            <p class="date">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
            <table>
                <thead>
                    <tr>
                        <th>Ordem</th>
                        <th>Nome</th>
                        <th>Dia(s)</th>
                        <th>Turno(s)</th>
                    </tr>
                </thead>
                <tbody>
    `;

    filtered.forEach(p => {
        html += `
            <tr>
                <td>${p.ordem}</td>
                <td>${p.nome}</td>
                <td>${p.dias}</td>
                <td>${p.turnos}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();

    showToast('Impressão iniciada');
}

// ============================================
// EVENT LISTENERS
// ============================================

// Busca
searchInput.addEventListener('input', renderTable);

// Botões
newRecordBtn.addEventListener('click', () => openModal());
exportExcelBtn.addEventListener('click', exportToExcel);
exportPdfBtn.addEventListener('click', exportToPDF);
printBtn.addEventListener('click', printReport);

// Modal
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
submitBtn.addEventListener('click', savePessoa);

// Fechar modal ao clicar fora
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Enter no formulário
recordForm.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        savePessoa();
    }
});

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});