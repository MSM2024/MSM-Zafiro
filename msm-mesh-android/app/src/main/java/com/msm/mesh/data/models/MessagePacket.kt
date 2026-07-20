package com.msm.mesh.data.models

import kotlinx.serialization.Serializable

@Serializable
data class MessagePacket(
    val id: String,
    val senderId: String,
    val senderName: String,
    val targetId: String,
    val payload: String,
    val type: MessageType,
    val timestamp: Long,
    val hopCount: Int = 0,
    val maxHops: Int = 7,
    val ttl: Long = 60000L,
    val signature: String = "",
    val relayPath: List<String> = emptyList(),
)

@Serializable
enum class MessageType(val label: String) {
    CHAT("Chat"),
    SYNC_REQUEST("Sync Request"),
    SYNC_RESPONSE("Sync Response"),
    DISCOVERY("Discovery"),
    GATEWAY_ANNOUNCE("Gateway Announce"),
    KEEPALIVE("Keep Alive"),
    ROUTING_UPDATE("Routing Update"),
    FILE_TRANSFER("File Transfer"),
}
