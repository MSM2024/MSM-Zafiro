package com.msm.mesh.mesh

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothServerSocket
import android.bluetooth.BluetoothSocket
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.BluetoothLeAdvertiser
import android.bluetooth.le.BluetoothLeScanner
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.os.ParcelUuid
import com.msm.mesh.data.models.NodeInfo
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.withContext
import java.io.IOException
import java.util.UUID

class BluetoothMeshManager(private val context: Context) {
    private val adapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
    private val meshServiceUuid = ParcelUuid(UUID.fromString("a1b2c3d4-e5f6-7890-abcd-ef1234567890"))

    private val _discoveredNodes = Channel<NodeInfo>(Channel.BUFFERED)
    val discoveredNodes: Flow<NodeInfo> = _discoveredNodes.receiveAsFlow()

    private var advertiser: BluetoothLeAdvertiser? = null
    private var scanner: BluetoothLeScanner? = null
    private var serverSocket: BluetoothServerSocket? = null
    private var isScanning = false

    fun isBluetoothEnabled(): Boolean = adapter?.isEnabled ?: false

    fun startAdvertising(nodeName: String) {
        if (!isBluetoothEnabled()) return
        adapter?.let { bt ->
            advertiser = bt.bluetoothLeAdvertiser
            val settings = AdvertiseSettings.Builder()
                .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_BALANCED)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM)
                .setConnectable(true)
                .build()

            val data = AdvertiseData.Builder()
                .setIncludeDeviceName(true)
                .addServiceUuid(meshServiceUuid)
                .build()

            advertiser?.startAdvertising(settings, data, object : AdvertiseCallback() {
                override fun onStartSuccess(settingsInEffect: AdvertiseSettings) {}
                override fun onStartFailure(errorCode: Int) {}
            })
        }
    }

    fun stopAdvertising() {
        advertiser?.stopAdvertising(object : AdvertiseCallback() {})
        advertiser = null
    }

    fun startScanning() {
        if (!isBluetoothEnabled() || isScanning) return
        adapter?.let { bt ->
            scanner = bt.bluetoothLeScanner
            val filters = listOf(ScanFilter.Builder().setServiceUuid(meshServiceUuid).build())
            val settings = ScanSettings.Builder()
                .setScanMode(ScanSettings.SCAN_MODE_BALANCED)
                .build()

            isScanning = true
            scanner?.startScan(filters, settings, scanCallback)
        }
    }

    fun stopScanning() {
        if (!isScanning) return
        scanner?.stopScan(scanCallback)
        isScanning = false
    }

    private val scanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            val device = result.device
            val node = NodeInfo(
                nodeId = device.address.replace(":", ""),
                displayName = device.name ?: "Unknown",
                deviceName = device.name ?: "Unknown",
                signalStrength = result.rssi,
                lastSeen = System.currentTimeMillis(),
            )
            _discoveredNodes.trySend(node)
        }
    }

    suspend fun connectToDevice(address: String): BluetoothSocket? = withContext(Dispatchers.IO) {
        try {
            val device = adapter?.getRemoteDevice(address) ?: return@withContext null
            val uuid = meshServiceUuid.uuid
            val socket = device.createRfcommSocketToServiceRecord(uuid)
            adapter?.cancelDiscovery()
            socket.connect()
            socket
        } catch (e: IOException) { null }
    }

    fun startServer() {
        try {
            serverSocket = adapter?.listenUsingRfcommWithServiceRecord("MSM Mesh", meshServiceUuid.uuid)
        } catch (e: IOException) {}
    }

    fun shutdown() {
        stopAdvertising()
        stopScanning()
        try { serverSocket?.close() } catch (_: IOException) {}
    }
}
