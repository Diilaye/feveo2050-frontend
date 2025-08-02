// Service Wave pour générer les liens de paiement
// /src/services/wavePaymentService.tsx

export interface PaymentRequest {
  amount: number;
  period: string;
  gieCode: string;
  giePhone?: string;
  description?: string;
}

export interface WavePaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  message?: string;
  error?: string;
}

class WavePaymentService {
  private baseUrl = import.meta.env.VITE_API_URL || 'https://api.feveo2025.sn/api';
  private waveToken = import.meta.env.VITE_WAVE_API_TOKEN || 'wave_sn_prod_FIdhHNGkeoAFnuGNxuh8WD3L9XjEBqjRCKx2zEZ87H7LWSwHs2v2aA_5q_ZJGwaLfphltYSRawKP-voVugCpwWB2FMH3ZTtC0w';

  /**
   * Génère un lien de paiement Wave avec les informations du GIE
   */
  async generatePaymentLink(paymentRequest: PaymentRequest): Promise<WavePaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/wave/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.waveToken}`
        },
        body: JSON.stringify({
          amount: paymentRequest.amount,
          period: paymentRequest.period,
          gieCode: paymentRequest.gieCode,
          giePhone: paymentRequest.giePhone,
          description: paymentRequest.description || `Investissement FEVEO 2050 - ${paymentRequest.gieCode}`,
          currency: 'XOF' // Franc CFA
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Erreur lors de la génération du lien de paiement'
        };
      }

      return {
        success: true,
        paymentUrl: data.paymentUrl,
        transactionId: data.transactionId,
        message: data.message
      };

    } catch (error) {
      console.error('Erreur Wave Payment Service:', error);
      return {
        success: false,
        error: 'Erreur de connexion au service de paiement'
      };
    }
  }

  /**
   * Génère un lien de paiement Wave via notre backend (fallback)
   */
  async generateSimplePaymentLink(amount: number, giePhone?: string): Promise<string> {
    try {
      // Utilisation de notre backend qui gère l'API Wave (évite les problèmes CORS)
      const response = await fetch(`${this.baseUrl}/payments/wave/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.waveToken}`
        },
        body: JSON.stringify({
          amount: amount,
          period: 'fallback',
          gieCode: 'FALLBACK-SIMPLE',
          giePhone: giePhone,
          description: `Paiement FEVEO 2050 - ${amount} FCFA`,
          currency: 'XOF'
        })
      });

      const data = await response.json();

      if (response.ok && data.paymentUrl) {
        console.log('✅ Lien de paiement généré via backend:', data.paymentUrl);
        return data.paymentUrl;
      } else {
        console.warn('Backend indisponible, utilisation de l\'URL Wave de base');
        return this.generateBasicWaveUrl(amount, giePhone);
      }

    } catch (error) {
      console.error('Erreur génération lien via backend:', error);
      // En cas d'erreur complète, utiliser une URL Wave de base
      return this.generateBasicWaveUrl(amount, giePhone);
    }
  }

  /**
   * Génère une URL Wave de base en dernier recours
   */
  private generateBasicWaveUrl(amount: number, giePhone?: string): string {
    // URL Wave générique qui devrait toujours fonctionner
    const baseUrl = 'https://pay.wave.com/quick-pay';
    const params = new URLSearchParams({
      amount: amount.toString(),
      currency: 'XOF'
    });

    if (giePhone) {
      params.append('phone', giePhone);
    }

    console.log('🔄 Utilisation de l\'URL Wave de base:', `${baseUrl}?${params.toString()}`);
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Vérifie le statut d'un paiement
   */
  async checkPaymentStatus(transactionId: string): Promise<{ status: string; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/wave/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.waveToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: 'error',
          message: data.message || 'Erreur lors de la vérification du statut'
        };
      }

      return {
        status: data.status,
        message: data.message
      };

    } catch (error) {
      console.error('Erreur vérification statut:', error);
      return {
        status: 'error',
        message: 'Erreur de connexion'
      };
    }
  }
}

export const wavePaymentService = new WavePaymentService();
