import { describe, it, expect } from 'vitest'
import { classifyIntent, getIntentLabel } from '../intent-classifier'

describe('intent-classifier', () => {
  it('classifies greeting', () => {
    expect(classifyIntent('Hola', false)).toBe('greeting')
    expect(classifyIntent('Buenas tardes', false)).toBe('greeting')
    expect(classifyIntent('Saludos', false)).toBe('greeting')
  })

  it('classifies greeting_spiritual', () => {
    expect(classifyIntent('Shalom', false)).toBe('greeting_spiritual')
    expect(classifyIntent('Bendiciones', false)).toBe('greeting_spiritual')
  })

  it('classifies help', () => {
    expect(classifyIntent('Ayuda', false)).toBe('help')
    expect(classifyIntent('Qué puedes hacer?', false)).toBe('help')
    expect(classifyIntent('help', false)).toBe('help')
  })

  it('classifies status', () => {
    expect(classifyIntent('status', false)).toBe('status')
    expect(classifyIntent('Estado del sistema', false)).toBe('status')
  })

  it('classifies knowledge_query', () => {
    expect(classifyIntent('Qué es ZAFIRO?', false)).toBe('knowledge_query')
    expect(classifyIntent('Explícame la frecuencia 369', false)).toBe('knowledge_query')
    expect(classifyIntent('Dime sobre el ecosistema MSM', false)).toBe('knowledge_query')
  })

  it('classifies financial', () => {
    expect(classifyIntent('transferir fondos', false)).toBe('financial')
    expect(classifyIntent('aprobar pago', false)).toBe('financial')
  })

  it('classifies cripto', () => {
    expect(classifyIntent('Quiero saber de cripto', false)).toBe('cripto')
    expect(classifyIntent('Binance wallet', false)).toBe('cripto')
  })

  it('classifies trading', () => {
    expect(classifyIntent('estrategia de trading', false)).toBe('trading')
    expect(classifyIntent('señal de compra BTC', false)).toBe('trading')
  })

  it('classifies remesas', () => {
    expect(classifyIntent('enviar dinero a Cuba', false)).toBe('remesas')
    expect(classifyIntent('cambio de moneda USD a CUP', false)).toBe('remesas')
  })

  it('classifies frecuencia_369', () => {
    expect(classifyIntent('369', false)).toBe('frecuencia_369')
    expect(classifyIntent('3 6 9', false)).toBe('frecuencia_369')
    expect(classifyIntent('frecuencia maestra', false)).toBe('frecuencia_369')
  })

  it('classifies membership_query', () => {
    expect(classifyIntent('Mi membresía', false)).toBe('membership_query')
    expect(classifyIntent('Qué plan tengo?', false)).toBe('membership_query')
    expect(classifyIntent('Estado de mi membresía', false)).toBe('membership_query')
  })

  it('classifies owner training intents', () => {
    expect(classifyIntent('{"key": "value"}', true)).toBe('training_json')
    expect(classifyIntent('```console.log("test")```', true)).toBe('training_code')
    expect(classifyIntent('https://ejemplo.com', true)).toBe('training_link')
  })

  it('does not classify training when not owner', () => {
    expect(classifyIntent('{"key": "value"}', false)).not.toBe('training_json')
    expect(classifyIntent('https://ejemplo.com', false)).not.toBe('training_link')
  })

  it('classifies chat_normal as fallback', () => {
    expect(classifyIntent('Me gusta el clima hoy', false)).toBe('chat_normal')
    expect(classifyIntent('12345', false)).toBe('chat_normal')
  })

  it('getIntentLabel returns correct labels', () => {
    expect(getIntentLabel('greeting')).toBe('Saludo')
    expect(getIntentLabel('trading')).toBe('Trading')
    expect(getIntentLabel('chat_normal')).toBe('Conversación')
    expect(getIntentLabel('remesas')).toBe('Remesas')
  })
})
