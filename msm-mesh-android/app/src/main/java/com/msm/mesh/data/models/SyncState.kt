package com.msm.mesh.data.models

import kotlinx.serialization.Serializable

@Serializable
data class SyncState(
    val nodeId: String,
    val lastSyncTimestamp: Long = 0L,
    val pendingOutgoing: Int = 0,
    val pendingIncoming: Int = 0,
    val totalSynced: Int = 0,
    val conflictsResolved: Int = 0,
    val isOnline: Boolean = false,
    val connectedGateways: List<String> = emptyList(),
)

@Serializable
data class SyncPayload(
    val operations: List<SyncOperation>,
    val timestamp: Long,
    val nodeId: String,
)

@Serializable
data class SyncOperation(
    val id: String,
    val entity: String,
    val entityId: String,
    val type: SyncOpType,
    val data: String,
    val previousData: String? = null,
    val timestamp: Long,
)

@Serializable
enum class SyncOpType { CREATE, UPDATE, DELETE }
