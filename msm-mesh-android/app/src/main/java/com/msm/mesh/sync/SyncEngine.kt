package com.msm.mesh.sync

import com.msm.mesh.data.models.SyncOperation
import com.msm.mesh.data.models.SyncOpType
import com.msm.mesh.data.models.SyncPayload
import com.msm.mesh.data.models.SyncState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.util.UUID

class SyncEngine(private val nodeId: String) {
    private val json = Json { ignoreUnknownKeys = true; encodeDefaults = true }

    private val _syncState = MutableStateFlow(SyncState(nodeId = nodeId))
    val syncState: StateFlow<SyncState> = _syncState

    private val pendingOperations = mutableListOf<SyncOperation>()
    private val confirmedOperations = mutableListOf<SyncOperation>()

    fun enqueueOperation(entity: String, entityId: String, type: SyncOpType, data: Any) {
        val op = SyncOperation(
            id = UUID.randomUUID().toString().take(12),
            entity = entity,
            entityId = entityId,
            type = type,
            data = json.encodeToString(data),
            timestamp = System.currentTimeMillis(),
        )
        pendingOperations.add(op)
        updateState()
    }

    fun buildSyncPayload(): SyncPayload {
        val ops = pendingOperations.toList()
        return SyncPayload(
            operations = ops,
            timestamp = System.currentTimeMillis(),
            nodeId = nodeId,
        )
    }

    fun applyRemotePayload(payload: SyncPayload): Int {
        var conflicts = 0
        for (op in payload.operations) {
            val localOp = pendingOperations.find { it.id == op.id }
            if (localOp != null) {
                if (resolveConflict(localOp, op)) {
                    confirmedOperations.add(op)
                } else {
                    conflicts++
                }
            } else {
                confirmedOperations.add(op)
            }
            pendingOperations.removeAll { it.id == op.id }
        }
        updateState()
        _syncState.value = _syncState.value.copy(conflictsResolved = _syncState.value.conflictsResolved + conflicts)
        return conflicts
    }

    private fun resolveConflict(local: SyncOperation, remote: SyncOperation): Boolean {
        return remote.timestamp >= local.timestamp
    }

    fun markSynced(count: Int) {
        val prev = _syncState.value
        _syncState.value = prev.copy(
            totalSynced = prev.totalSynced + count,
            lastSyncTimestamp = System.currentTimeMillis(),
        )
    }

    fun setOnline(online: Boolean) {
        _syncState.value = _syncState.value.copy(isOnline = online)
    }

    private fun updateState() {
        val prev = _syncState.value
        _syncState.value = prev.copy(
            pendingOutgoing = pendingOperations.size,
            pendingIncoming = 0,
        )
    }

    fun getPendingCount(): Int = pendingOperations.size
    fun getConfirmedCount(): Int = confirmedOperations.size
}
