cmake_minimum_required(VERSION 3.10)

set(PLUGIN_NAME "WebSocketPlugin")
add_library(${PLUGIN_NAME} SHARED)

# FIND_PACKAGE(websocketpp REQUIRED)

target_sources(${PLUGIN_NAME} PRIVATE
	"${CMAKE_CURRENT_SOURCE_DIR}/SocketHandler.cpp"
	"${CMAKE_CURRENT_SOURCE_DIR}/SocketHandler.h"
)

target_include_directories(${PLUGIN_NAME} PRIVATE
	"${SM_BASE}/extern/jsoncpp/include"
    "${CMAKE_CURRENT_SOURCE_DIR}/libs/websocketpp/"
)

# target_link_libraries(${PLUGIN_NAME}
# 	websocketpp::websocketpp
# )
