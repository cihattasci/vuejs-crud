<template>
<div id="app">
  <v-app id="inspire">
    <v-data-table
      :headers="headers"
      :items="students"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                New Student
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        label="Student name"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.age"
                        label="Age"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.grade"
                        label="Grade"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.country"
                        label="Country"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-text-field
                        v-model="editedItem.department"
                        label="Department"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-app>
</div>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Student Name', value: 'name', sortable: false},
      { text: 'Age', value: 'age', sortable: false },
      { text: 'Grade', value: 'grade', sortable: false },
      { text: 'Country', value: 'country', sortable: false },
      { text: 'Department', value: 'department', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    students: [],
    id: null,
    editedIndex: -1,
    editedItem: {
      name: '',
      age: 0,
      grade: 0,
      country: '',
      department: '',
    },
    defaultItem: {
      name: '',
      age: 0,
      grade: 0,
      country: '',
      department: '',
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Student' : 'Edit Student'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.getStudents();
  },

  methods: {
    getStudents() {
      fetch('https://crudcrud.com/api/ac71f9c77e4844adaf9ad6738ab43327/students', {
        headers: { "Content-Type": "application/json; charset=utf-8" },
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => this.students = data)
    },
    editItem (item) {
      this.id = item._id;
      this.editedIndex = this.students.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.id = item._id;
      this.editedIndex = this.students.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      fetch(`https://crudcrud.com/api/ac71f9c77e4844adaf9ad6738ab43327/students/${this.id}`, {
        method: 'DELETE',
      })
      this.students.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        delete this.editedItem._id;
        fetch(`https://crudcrud.com/api/ac71f9c77e4844adaf9ad6738ab43327/students/${this.id}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(this.editedItem),
        })
        .then(() => {
          this.editedItem._id = this.id;
          this.students[this.editedIndex] = this.editedItem
          this.getStudents()
        })
      } else {
        fetch(`https://crudcrud.com/api/ac71f9c77e4844adaf9ad6738ab43327/students/`, {
          headers: { "Content-Type": "application/json; charset=utf-8" },
          method: 'POST',
          body: JSON.stringify(this.editedItem),
        })
        .then(response => response.json())
        .then(data => this.students.push(data))
      }
      this.close()
    },
  },
};
</script>