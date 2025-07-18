import { Component, OnInit } from '@angular/core';
import { DashboardService, ProdutoVendaData } from './dashboard.service';

// Chart.js já está disponível globalmente via CDN

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  vendasPorProduto: ProdutoVendaData[] = [];
  resumoVendas: any = {};
  carregando = true;
  erro: string | null = null;
  
  // Referências para os gráficos
  chartProdutos: any = null;
  chartVendasMensais: any = null;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;
    this.erro = null;

    // Carregar dados de vendas por produto
    this.dashboardService.getVendasPorProduto().subscribe({
      next: (data: ProdutoVendaData[]) => {
        this.vendasPorProduto = data;
        this.criarGraficoProdutos();
        this.carregando = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar vendas por produto', error);
        this.erro = 'Não foi possível carregar os dados de vendas por produto.';
        this.carregando = false;
      }
    });

    // Carregar resumo de vendas
    this.dashboardService.getResumoVendas().subscribe({
      next: (data: any) => {
        this.resumoVendas = data;
        this.criarGraficoVendasMensais();
      },
      error: (error: any) => {
        console.error('Erro ao carregar resumo de vendas', error);
        this.erro = 'Não foi possível carregar o resumo de vendas.';
      }
    });
  }

  criarGraficoProdutos(): void {
    // Destruir gráfico existente se houver
    if (this.chartProdutos) {
      this.chartProdutos.destroy();
    }

    // Preparar dados para o gráfico
    const labels = this.vendasPorProduto.slice(0, 10).map(item => item.nomeProduto);
    const valores = this.vendasPorProduto.slice(0, 10).map(item => item.valorTotal);
    const quantidades = this.vendasPorProduto.slice(0, 10).map(item => item.quantidadeVendida);

    // Criar novo gráfico
    const ctx = document.getElementById('grafico-produtos') as HTMLCanvasElement;
    if (ctx) {
      this.chartProdutos = new (window as any).Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Valor Total (R$)',
              data: valores,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              label: 'Quantidade Vendida',
              data: quantidades,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              type: 'line',
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Valor Total (R$)'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Quantidade'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      });
    }
  }

  criarGraficoVendasMensais(): void {
    if (!this.resumoVendas.vendasPorMes) return;

    // Destruir gráfico existente se houver
    if (this.chartVendasMensais) {
      this.chartVendasMensais.destroy();
    }

    const labels = this.resumoVendas.vendasPorMes.map((item: any) => item.rotulo);
    const valores = this.resumoVendas.vendasPorMes.map((item: any) => item.valor);
    const quantidades = this.resumoVendas.vendasPorMes.map((item: any) => item.quantidade);

    // Criar novo gráfico
    const ctx = document.getElementById('grafico-vendas-mensais') as HTMLCanvasElement;
    if (ctx) {
      this.chartVendasMensais = new (window as any).Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Valor Total (R$)',
              data: valores,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              tension: 0.3,
              yAxisID: 'y'
            },
            {
              label: 'Quantidade de Vendas',
              data: quantidades,
              backgroundColor: 'rgba(153, 102, 255, 0.5)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 2,
              tension: 0.3,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Valor Total (R$)'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Quantidade'
              },
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      });
    }
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarPercentual(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
