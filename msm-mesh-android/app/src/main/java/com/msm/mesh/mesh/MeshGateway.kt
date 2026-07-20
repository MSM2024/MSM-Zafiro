package com.msm.mesh.mesh

import com.msm.mesh.data.models.NodeInfo
import com.msm.mesh.data.models.MessagePacket
import com.msm.mesh.data.models.MessageType
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

class MeshGateway(private val node: MeshNode) {
    private val _isGatewayActive = MutableStateFlow(false)
    val isGatewayActive: StateFlow<Boolean> = _isGatewayActive

    private val _connectedClients = MutableStateFlow<List<NodeInfo>>(emptyList())
    val connectedClients: StateFlow<List<NodeInfo>> = _connectedClients

    private val _relayedMessages = MutableStateFlow(0)
    val relayedMessages: StateFlow<Int> = _relayedMessages

    fun activate() {
        node.promoteToGateway()
        _isGatewayActive.value = true
    }

    fun deactivate() {
        _isGatewayActive.value = false
        _connectedClients.value = emptyList()
    }

    fun registerClient(client: NodeInfo) {
        val current = _connectedClients.value.toMutableList()
        if (current.none { it.nodeId == client.nodeId }) {
            current.add(client)
            _connectedClients.value = current
        }
    }

    fun unregisterClient(nodeId: String) {
        _connectedClients.value = _connectedClients.value.filter { it.nodeId != nodeId }
    }

    fun relayMessage(msg: MessagePacket): MessagePacket? {
        if (!_isGatewayActive.value) return null
        if (msg.hopCount >= msg.maxHops) return null
        if (System.currentTimeMillis() - msg.timestamp > msg.ttl) return null

        _relayedMessages.value = _relayedMessages.value + 1

        return msg.copy(
            hopCount = msg.hopCount + 1,
            relayPath = msg.relayPath + node.nodeInfo.value.nodeId,
        )
    }

    fun getGatewayAnnouncement(): MessagePacket {
        return MessagePacket(
            id = "gw-${node.nodeInfo.value.nodeId}-${System.currentTimeMillis()}",
            senderId = node.nodeInfo.value.nodeId,
            senderName = node.nodeInfo.value.displayName,
            targetId = "broadcast",
            payload = "{\"type\":\"gateway\",\"clients\":${_connectedClients.value.size}}",
            type = MessageType.GATEWAY_ANNOUNCE,
            timestamp = System.currentTimeMillis(),
        )
    }
}
