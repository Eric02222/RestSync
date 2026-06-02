export function getHeartRateStatus(fc) {
  if (!fc) return 'normal';
  if (fc > 120 || fc < 50) return 'critical';
  if (fc >= 90 || fc <= 55) return 'attention';
  return 'normal';
}

export function getTemperatureStatus(temp) {
  if (!temp) return 'normal';
  const t = parseFloat(temp);
  if (t >= 38.0 || t <= 35.0) return 'critical';
  if (t >= 37.2) return 'attention';
  return 'normal';
}

export function buildAnomaliesFromHistorico(historico, limit = 8) {
  return historico
    .slice(0, 15)
    .map((reading) => {
      const fcStatus = getHeartRateStatus(reading.frequencia_cardiaca);
      const tempStatus = getTemperatureStatus(reading.temperatura);
      const ts = `${String(reading.data).split('-').reverse().slice(0, 2).join('/')} às ${String(reading.hora).slice(0, 5)}`;
      const list = [];

      if (fcStatus === 'critical') {
        list.push({
          status: 'critical',
          message: `Frequência cardíaca crítica: ${reading.frequencia_cardiaca} bpm.`,
          timestamp: ts,
        });
      } else if (fcStatus === 'attention') {
        list.push({
          status: 'attention',
          message: `Frequência cardíaca alterada: ${reading.frequencia_cardiaca} bpm.`,
          timestamp: ts,
        });
      }

      if (tempStatus === 'critical') {
        list.push({
          status: 'critical',
          message: `Temperatura crítica: ${reading.temperatura} °C.`,
          timestamp: ts,
        });
      } else if (tempStatus === 'attention') {
        list.push({
          status: 'attention',
          message: `Temperatura alterada: ${reading.temperatura} °C.`,
          timestamp: ts,
        });
      }

      return list;
    })
    .flat()
    .slice(0, limit);
}
