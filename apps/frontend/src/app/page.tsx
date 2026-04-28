export default function Home() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-badge">doacoesIA</span>
          <strong>Gestão inteligente de doações</strong>
        </div>
        <nav className="nav">
          <a href="#dashboard">Dashboard</a>
          <a href="#cadastro">Cadastro</a>
          <a href="#doacoes">Doações</a>
        </nav>
      </header>

      <main className="container">
        <section className="hero">
          <p className="eyebrow">MVP pronto para evolução</p>
          <h1>Plataforma moderna, fluida e mobile-first para assistência social</h1>
          <p>
            Estrutura preparada para doador, comissão e gestão, com backend em
            NestJS + Prisma e deploy automatizado em EasyPanel.
          </p>
        </section>

        <section id="dashboard" className="grid cards-grid">
          <article className="card">
            <h2>Resumo operacional</h2>
            <p>98 propostas recebidas</p>
            <p>24 em análise</p>
            <p>61 aprovadas</p>
          </article>
          <article className="card">
            <h2>Eixo prioritário</h2>
            <p>Pessoas idosas</p>
            <p>Maior demanda por mobilidade e acessibilidade.</p>
          </article>
          <article className="card">
            <h2>Status da API</h2>
            <p>Endpoint de saúde disponível em <code>/api/health</code>.</p>
          </article>
        </section>

        <section id="cadastro" className="card form-card">
          <h2>Cadastro rápido de doador</h2>
          <form className="form-grid">
            <label>
              Nome / Razão Social
              <input type="text" placeholder="Ex.: Empresa Exemplo LTDA" />
            </label>
            <label>
              CPF/CNPJ
              <input type="text" placeholder="00.000.000/0001-00" />
            </label>
            <label>
              E-mail
              <input type="email" placeholder="contato@empresa.com" />
            </label>
            <label>
              Telefone
              <input type="tel" placeholder="(16) 99999-9999" />
            </label>
            <button type="button">Salvar cadastro</button>
          </form>
        </section>

        <section id="doacoes" className="card">
          <h2>Fila de doações</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Eixo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kits de higiene</td>
                  <td>Pessoas em situação de rua</td>
                  <td><span className="pill pending">Em análise</span></td>
                </tr>
                <tr>
                  <td>Cadeiras de rodas</td>
                  <td>Pessoa idosa</td>
                  <td><span className="pill approved">Aprovada</span></td>
                </tr>
                <tr>
                  <td>Reforma de espaço</td>
                  <td>Crianças e adolescentes</td>
                  <td><span className="pill submitted">Enviada</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
