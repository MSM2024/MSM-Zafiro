package com.msm.mesh.mesh

import com.msm.mesh.data.models.NodeInfo
import com.msm.mesh.data.models.NodeRole
import com.msm.mesh.data.models.MessagePacket
import com.msm.mesh.data.models.MessageType
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import java.util.UUID

class MeshNode private constructor() {
    private val _nodeInfo = MutableStateFlow(
        NodeInfo(
            nodeId = UUID.randomUUID().toString().take(8),
            displayName = android.os.Build.MODEL,
            deviceName = android.os.Build.DEVICE,
        )
    )
    val nodeInfo: StateFlow<NodeInfo> = _nodeInfo

    private val _discoveredNodes = MutableStateFlow<List<NodeInfo>>(emptyList())
    val discoveredNodes: StateFlow<List<NodeInfo>> = _discoveredNodes

    private val _messages = MutableStateFlow<List<MessagePacket>>(emptyList())
    val messages: StateFlow<List<MessagePacket>> = _messages

    private val _role = MutableStateFlow(NodeRole.LEAF)
    val role: StateFlow<NodeRole> = _role

    fun setDisplayName(name: String) {
        _nodeInfo.value = _nodeInfo.value.copy(displayName = name)
    }

    fun promoteToRelay() { _role.value = NodeRole.RELAY }

    fun promoteToGateway() { _role.value = NodeRole.GATEWAY }

    fun addDiscoveredNode(node: NodeInfo) {
        val current = _discoveredNodes.value.toMutableList()
        val idx = current.indexOfFirst { it.nodeId == node.nodeId }
        if (idx >= 0) current[idx] = node else current.add(node)
        _discoveredNodes.value = current
    }

    fun removeNode(nodeId: String) {
        _discoveredNodes.value = _discoveredNodes.value.filter { it.nodeId != nodeId }
    }

    fun addMessage(msg: MessagePacket) {
        _messages.value = _messages.value + msg
    }

    fun getMessagesWith(nodeId: String): List<MessagePacket> {
        return _messages.value.filter { it.senderId == nodeId || it.targetId == nodeId }
    }

    fun createMessage(targetId: String, payload: String, type: MessageType = MessageType.CHAT): MessagePacket {
        return MessagePacket(
            id = UUID.randomUUID().toString().take(12),
            senderId = _nodeInfo.value.nodeId,
            senderName = _nodeInfo.value.displayName,
            targetId = targetId,
            payload = payload,
            type = type,
            timestamp = System.currentTimeMillis(),
        )
    }

    companion object {
        @Volatile private var instance: MeshNode? = null
        fun getInstance(): MeshNode = instance ?: synchronized(this) {
            instance ?: MeshNode().also { instance = it }
        }
    }
}
