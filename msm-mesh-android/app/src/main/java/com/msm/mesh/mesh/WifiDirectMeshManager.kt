package com.msm.mesh.mesh

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.wifi.WifiManager
import android.net.wifi.p2p.WifiP2pConfig
import android.net.wifi.p2p.WifiP2pDevice
import android.net.wifi.p2p.WifiP2pDeviceList
import android.net.wifi.p2p.WifiP2pManager
import android.net.wifi.p2p.nsd.WifiP2pDnsSdServiceInfo
import android.net.wifi.p2p.nsd.WifiP2pDnsSdServiceRequest
import android.net.wifi.p2p.nsd.WifiP2pServiceInfo
import android.net.wifi.p2p.nsd.WifiP2pServiceRequest
import android.os.Build
import com.msm.mesh.data.models.NodeInfo
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.receiveAsFlow
import java.util.HashMap

class WifiDirectMeshManager(private val context: Context) {
    private val wifiP2pManager: WifiP2pManager by lazy {
        context.getSystemService(Context.WIFI_P2P_SERVICE) as WifiP2pManager
    }
    private val channel: WifiP2pManager.Channel by lazy {
        wifiP2pManager.initialize(context, context.mainLooper, null)
    }

    private val _discoveredNodes = Channel<NodeInfo>(Channel.BUFFERED)
    val discoveredNodes: Flow<NodeInfo> = _discoveredNodes.receiveAsFlow()

    private var serviceInfo: WifiP2pServiceInfo? = null
    private val receiver = P2pBroadcastReceiver()

    fun registerService(instanceName: String, serviceType: String = "_msm-mesh._tcp") {
        val txtMap = HashMap<String, String>().apply {
            put("version", "0.1.0")
            put("role", "node")
        }
        serviceInfo = WifiP2pDnsSdServiceInfo.newInstance(instanceName, serviceType, txtMap)
        wifiP2pManager.addLocalService(channel, serviceInfo) { /* success/fail */ }
    }

    fun discoverServices(serviceType: String = "_msm-mesh._tcp") {
        val serviceRequest = WifiP2pDnsSdServiceRequest.newInstance(serviceType)
        wifiP2pManager.setDnsSdResponseListeners(channel,
            { instanceName, registrationType, srcDevice ->
                val node = NodeInfo(
                    nodeId = srcDevice.deviceAddress.replace(":", ""),
                    displayName = instanceName,
                    deviceName = srcDevice.deviceName ?: "Unknown",
                    signalStrength = 0,
                    lastSeen = System.currentTimeMillis(),
                )
                _discoveredNodes.trySend(node)
            },
            { fullDomain, srcDevice, txtMap -> }
        )
        wifiP2pManager.addServiceRequest(channel, serviceRequest) {
            wifiP2pManager.discoverServices(channel) {}
        }
    }

    fun connect(deviceAddress: String) {
        val config = WifiP2pConfig().apply {
            deviceAddress = deviceAddress
            groupOwnerIntent = 15
        }
        wifiP2pManager.connect(channel, config) {}
    }

    fun registerReceiver() {
        val filter = IntentFilter().apply {
            addAction(WifiP2pManager.WIFI_P2P_STATE_CHANGED_ACTION)
            addAction(WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION)
            addAction(WifiP2pManager.WIFI_P2P_CONNECTION_CHANGED_ACTION)
            addAction(WifiP2pManager.WIFI_P2P_THIS_DEVICE_CHANGED_ACTION)
        }
        context.registerReceiver(receiver, filter)
    }

    fun unregisterReceiver() {
        try { context.unregisterReceiver(receiver) } catch (_: IllegalArgumentException) {}
    }

    fun cleanup() {
        unregisterReceiver()
        try { wifiP2pManager.removeLocalService(channel, serviceInfo) {} } catch (_: Exception) {}
        wifiP2pManager.clearLocalServices(channel) {}
        wifiP2pManager.clearServiceRequests(channel) {}
    }

    private inner class P2pBroadcastReceiver : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            when (intent.action) {
                WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION -> {
                    wifiP2pManager.requestPeers(channel) { peers ->
                        val deviceList = peers.deviceList
                        deviceList.forEach { device ->
                            val node = NodeInfo(
                                nodeId = device.deviceAddress.replace(":", ""),
                                displayName = device.deviceName ?: "Unknown",
                                deviceName = device.deviceName ?: "Unknown",
                                signalStrength = 0,
                                lastSeen = System.currentTimeMillis(),
                            )
                            _discoveredNodes.trySend(node)
                        }
                    }
                }
            }
        }
    }
}
