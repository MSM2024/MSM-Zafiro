package com.msm.mesh.mesh

import com.msm.mesh.data.models.MessagePacket
import com.msm.mesh.data.models.MessageType
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

object MeshProtocol {
    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }

    const val PROTOCOL_VERSION = "0.1.0"
    const val MAX_HOPS = 7
    const val DEFAULT_TTL = 60000L

    fun serialize(msg: MessagePacket): ByteArray {
        return json.encodeToString(msg).toByteArray(Charsets.UTF_8)
    }

    fun deserialize(data: ByteArray): MessagePacket? {
        return try {
            json.decodeFromString<MessagePacket>(data.toString(Charsets.UTF_8))
        } catch (e: Exception) { null }
    }

    fun createDiscoveryMessage(nodeId: String, nodeName: String): MessagePacket {
        return MessagePacket(
            id = "disc-$nodeId-${System.currentTimeMillis()}",
            senderId = nodeId,
            senderName = nodeName,
            targetId = "broadcast",
            payload = "{\"protocol\":\"$PROTOCOL_VERSION\",\"capabilities\":[\"chat\",\"sync\"]}",
            type = MessageType.DISCOVERY,
            timestamp = System.currentTimeMillis(),
        )
    }

    fun createKeepAlive(nodeId: String): MessagePacket {
        return MessagePacket(
            id = "ka-$nodeId-${System.currentTimeMillis()}",
            senderId = nodeId,
            senderName = "",
            targetId = "broadcast",
            payload = "",
            type = MessageType.KEEPALIVE,
            timestamp = System.currentTimeMillis(),
        )
    }

    fun buildRoutingUpdate(nodeId: String, knownNodes: List<String>): MessagePacket {
        return MessagePacket(
            id = "route-$nodeId-${System.currentTimeMillis()}",
            senderId = nodeId,
            senderName = "",
            targetId = "broadcast",
            payload = knownNodes.joinToString(","),
            type = MessageType.ROUTING_UPDATE,
            timestamp = System.currentTimeMillis(),
            hopCount = 0,
        )
    }
}
