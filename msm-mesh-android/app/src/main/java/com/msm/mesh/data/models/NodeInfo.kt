package com.msm.mesh.data.models

import kotlinx.serialization.Serializable

@Serializable
data class NodeInfo(
    val nodeId: String,
    val displayName: String,
    val deviceName: String,
    val meshVersion: String = "0.1.0",
    val capabilities: List<String> = emptyList(),
    val publicKey: String = "",
    val lastSeen: Long = 0L,
    val signalStrength: Int = 0,
    val isGateway: Boolean = false,
    val connectedNodes: List<String> = emptyList(),
)

enum class NodeRole(val label: String) {
    LEAF("Leaf"),
    RELAY("Relay"),
    GATEWAY("Gateway"),
    COORDINATOR("Coordinator"),
}
