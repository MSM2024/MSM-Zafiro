package com.msm.mesh.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.msm.mesh.mesh.MeshNode
import com.msm.mesh.data.models.MessageType
import com.msm.mesh.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(navController: NavController, nodeId: String) {
    val node = remember { MeshNode.getInstance() }
    val messages by node.messages.collectAsState()
    val nodeInfo by node.nodeInfo.collectAsState()
    var inputText by remember { mutableStateOf("") }
    val listState = rememberLazyListState()

    val convMessages = remember(messages) { node.getMessagesWith(nodeId) }

    LaunchedEffect(convMessages.size) {
        if (convMessages.isNotEmpty()) listState.animateScrollToItem(convMessages.size - 1)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Nodo $nodeId", fontSize = 14.sp) },
                navigationIcon = {
                    TextButton(onClick = { navController.popBackStack() }) { Text("←") }
                },
            )
        },
        bottomBar = {
            Surface(tonalElevation = 4.dp) {
                Row(
                    Modifier.fillMaxWidth().padding(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    TextField(
                        value = inputText,
                        onValueChange = { inputText = it },
                        modifier = Modifier.weight(1f),
                        placeholder = { Text("Mensaje...", fontSize = 13.sp) },
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = DarkCard,
                            unfocusedContainerColor = DarkCard,
                        ),
                    )
                    Spacer(Modifier.width(8.dp))
                    Button(
                        onClick = {
                            if (inputText.isNotBlank()) {
                                val msg = node.createMessage(nodeId, inputText, MessageType.CHAT)
                                node.addMessage(msg)
                                inputText = ""
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Cyan500),
                    ) { Text("Enviar", fontSize = 12.sp) }
                }
            }
        }
    ) { padding ->
        if (convMessages.isEmpty()) {
            Box(Modifier.fillMaxSize().padding(padding), contentAlignment = Alignment.Center) {
                Text("Sin mensajes aún", color = TextSecondary, fontSize = 13.sp)
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize().padding(padding).padding(horizontal = 12.dp),
                state = listState,
                verticalArrangement = Arrangement.spacedBy(6.dp),
            ) {
                items(convMessages) { msg ->
                    val isMine = msg.senderId == nodeInfo.nodeId
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = if (isMine) Alignment.End else Alignment.Start,
                    ) {
                        Surface(
                            shape = MaterialTheme.shapes.medium,
                            color = if (isMine) Cyan500.copy(alpha = 0.2f) else DarkCard,
                            tonalElevation = 2.dp,
                        ) {
                            Column(Modifier.padding(10.dp).maxWidth(280.dp)) {
                                Text(msg.payload, fontSize = 13.sp)
                                Text(
                                    msg.senderName,
                                    fontSize = 9.sp,
                                    color = TextSecondary,
                                    modifier = Modifier.align(if (isMine) Alignment.End else Alignment.Start),
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
