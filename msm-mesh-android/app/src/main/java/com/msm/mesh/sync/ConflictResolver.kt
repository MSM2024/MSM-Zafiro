package com.msm.mesh.sync

import com.msm.mesh.data.models.SyncOperation

enum class ConflictStrategy { LOCAL_WINS, REMOTE_WINS, TIMESTAMP_WINS, MANUAL }

class ConflictResolver(private val defaultStrategy: ConflictStrategy = ConflictStrategy.TIMESTAMP_WINS) {

    private val entityStrategies = mutableMapOf<String, ConflictStrategy>()

    fun setStrategy(entity: String, strategy: ConflictStrategy) {
        entityStrategies[entity] = strategy
    }

    fun resolve(local: SyncOperation, remote: SyncOperation): SyncOperation {
        val strategy = entityStrategies[local.entity] ?: defaultStrategy
        return when (strategy) {
            ConflictStrategy.LOCAL_WINS -> local
            ConflictStrategy.REMOTE_WINS -> remote
            ConflictStrategy.TIMESTAMP_WINS -> if (remote.timestamp >= local.timestamp) remote else local
            ConflictStrategy.MANUAL -> local
        }
    }
}
