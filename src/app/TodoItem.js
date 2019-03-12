import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Icon from "react-native-vector-icons/MaterialIcons";

const FETCH_TODOS = gql`
  query {
    todos {
      id
      text
      is_completed
    }
  }
`;

const UPDATE_TODO = gql`
  mutation($id: Int, $isCompleted: Boolean) {
    update_todos(
      _set: { is_completed: $isCompleted }
      where: { id: { _eq: $id } }
    ) {
      returning {
        id
        text
        is_completed
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation($id: Int) {
    delete_todos(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export default class TodoItem extends React.Component {
  render() {
    const { item, isPublic } = this.props;
    return (
      <View style={styles.todoContainer}>
        <Mutation
          mutation={UPDATE_TODO}
          variables={{
            id: item.id,
            isCompleted: !item.is_completed
          }}
        >
          {(updateTodo, { loading, error }) => {
            if (error) {
              return <Text> Error </Text>;
            }
            const update = () => {
              if (loading) {
                return;
              }
              updateTodo();
            };
            return (
              <View style={styles.todoTextWrapper}>
                <Text
                  style={
                    item.is_completed ? styles.completedText : styles.activeText
                  }
                >
                  {item.text}
                </Text>
              </View>
            );
          }}
        </Mutation>
        <Mutation
          mutation={DELETE_TODO}
          variables={{
            id: item.id
          }}
          update={cache => {
            const data = cache.readQuery({
              query: FETCH_TODOS
            });
            const newData = {
              todos: data.todos.filter(t => t.id !== item.id)
            };
            cache.writeQuery({
              query: FETCH_TODOS,
              data: newData
            });
          }}
        >
          {(deleteTodo, { loading, error }) => {
            if (error) {
              return <Text> Error </Text>;
            }
            const remove = () => {
              if (loading) {
                return;
              }
              deleteTodo();
            };
            return (
              <View style={styles.deleteButton}>
                <Icon
                  name="delete"
                  size={26}
                  onPress={remove}
                  disabled={loading}
                  color={loading ? "lightgray" : "#BC0000"}
                />
              </View>
            );
          }}
        </Mutation>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  todoContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  todoTextWrapper: {},
  deleteButton: {}
});
