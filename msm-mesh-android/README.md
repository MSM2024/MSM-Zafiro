# MSM Mesh — Android

Red mesh descentralizada para conectar dispositivos Android sin internet.

## Arquitectura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Nodo Leaf   │◄───►│  Nodo Relay  │◄───►│ Nodo Gateway│
│ (Bluetooth)  │     │ (Wi-Fi Dir) │     │  (ambos)    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                        ┌──────▼──────┐
                                        │   Internet   │
                                        │  (opcional)  │
                                        └─────────────┘
```

## Componentes

| Capa | Archivo | Propósito |
|------|---------|-----------|
| **Modelos** | `data/models/` | NodeInfo, MessagePacket, SyncState, SyncPayload |
| **Bluetooth** | `mesh/BluetoothMeshManager.kt` | BLE advertising + scanning, RFCOMM sockets |
| **Wi-Fi Direct** | `mesh/WifiDirectMeshManager.kt` | P2P discovery + connection |
| **Protocolo** | `mesh/MeshProtocol.kt` | Serialización, routing, keep-alive |
| **Gateway** | `mesh/MeshGateway.kt` | Modo gateway: relay, client registration |
| **Nodo** | `mesh/MeshNode.kt` | Singleton del nodo local, estado |
| **Sync** | `sync/SyncEngine.kt` | Cola de operaciones, sync payload, conflict resolution |
| **Crypto** | `crypto/MeshCrypto.kt` | ECDSA keys, ECDH shared secret, AES-GCM encrypt |
| **UI** | `ui/` | Jetpack Compose: Main, Discovery, Chat, Gateway |

## Roles de nodo

| Rol | Función |
|-----|---------|
| **Leaf** | Nodo final. Solo se conecta a un relay o gateway |
| **Relay** | Retransmite mensajes entre nodos que no se ven directamente |
| **Gateway** | Relay + conexión a internet. Anuncia su presencia periódicamente |

## Requisitos

- Android 8.0+ (minSdk 26)
- Bluetooth 4.2+ (BLE)
- Wi-Fi Direct
- Permisos: BLUETOOTH_SCAN, BLUETOOTH_CONNECT, ACCESS_FINE_LOCATION

## Construir

```bash
./gradlew assembleDebug
```

## Próximos pasos

- [ ] Mesh routing table (proactivo, no flooding)
- [ ] File transfer sobre mesh
- [ ] Bridge con ZAFIRO web vía API REST
- [ ] Cifrado post-cuántico (Kyber/Dilithium)
- [ ] Modo offline gateway (almacenar y reenviar)
- [ ] Interfaz de administración de red mesh
