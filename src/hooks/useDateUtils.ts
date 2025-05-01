import { format, addDays, subDays, startOfWeek } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

/**
 * Hook para centralizar e padronizar todas as operações de manipulação de datas
 * Resolve problemas de fuso horário e inconsistências de formatação
 */
export const useDateUtils = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'pt-BR' ? ptBR : enUS;

  /**
   * Formata uma data para o formato YYYY-MM-DD (ISO local)
   * Garante que a data seja tratada no fuso horário local
   */
  const formatToYYYYMMDD = (date: Date): string => {
    // Método confiável e consistente para formatação local sem perda de informação de fuso horário
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * Converte string YYYY-MM-DD para objeto Date
   * Garante que a data seja interpretada corretamente no fuso horário local
   * com hora definida para meio-dia para evitar problemas de mudança de dia com UTC
   */
  const parseFromYYYYMMDD = (dateString: string): Date => {
    // Parse a string usando o método manual para evitar problemas de timezone
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    
    // Cria uma data no fuso horário local e define a hora para 12:00 (meio-dia)
    // para evitar que a data mude ao converter para UTC
    const date = new Date(year, month - 1, day, 12, 0, 0);
    return date;
  };

  /**
   * Obtém a data de hoje formatada como YYYY-MM-DD
   */
  const getTodayFormatted = (): string => {
    return formatToYYYYMMDD(new Date());
  };

  /**
   * Formata data para exibição de acordo com o locale atual
   * Útil para mostrar datas em interfaces de usuário
   */
  const formatForDisplay = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? parseFromYYYYMMDD(date) : date;
    return format(dateObj, 'dd MMM yyyy', { locale });
  };

  /**
   * Adiciona dias a uma data e retorna o resultado formatado
   */
  const addDaysFormatted = (date: Date | string, daysToAdd: number): string => {
    const dateObj = typeof date === 'string' ? parseFromYYYYMMDD(date) : date;
    return formatToYYYYMMDD(addDays(dateObj, daysToAdd));
  };

  /**
   * Subtrai dias de uma data e retorna o resultado formatado
   */
  const subtractDaysFormatted = (date: Date | string, daysToSubtract: number): string => {
    const dateObj = typeof date === 'string' ? parseFromYYYYMMDD(date) : date;
    return formatToYYYYMMDD(subDays(dateObj, daysToSubtract));
  };

  /**
   * Compara duas datas para verificar se são o mesmo dia (ignorando horas)
   * Usa strings formatadas para garantir comparação consistente,
   * independente de fuso horário.
   */
  const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
    const formattedDate1 = typeof date1 === 'string' ? date1 : formatToYYYYMMDD(date1);
    const formattedDate2 = typeof date2 === 'string' ? date2 : formatToYYYYMMDD(date2);
    return formattedDate1 === formattedDate2;
  };

  /**
   * Obtém o início da semana para uma data específica
   */
  const getWeekStart = (date: Date | string): Date => {
    const dateObj = typeof date === 'string' ? parseFromYYYYMMDD(date) : date;
    return startOfWeek(dateObj, { locale });
  };

  return {
    formatToYYYYMMDD,
    parseFromYYYYMMDD,
    getTodayFormatted,
    formatForDisplay,
    addDaysFormatted,
    subtractDaysFormatted,
    isSameDay,
    getWeekStart,
    locale
  };
};

export default useDateUtils;
