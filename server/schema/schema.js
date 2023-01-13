const Job = require("../models/Job");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLSchema,
  GraphQLString,
  GraphQLScalarType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");
const Client = require("../models/Client");

//client

const ClientType = new GraphQLObjectType({
  name: "Clients",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone: { type: GraphQLNonNull(GraphQLString) },
    payment: { type: GraphQLNonNull(GraphQLString) },
    kra_pin: { type: GraphQLNonNull(GraphQLString) },
    location: { type: GraphQLNonNull(GraphQLString) },
  }),
});

const JobType = new GraphQLObjectType({
  name: "job",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLNonNull(GraphQLString) },
    container: { type: GraphQLNonNull(GraphQLString) },
    size: { type: GraphQLNonNull(GraphQLString) },
    weight: { type: GraphQLNonNull(GraphQLString) },
    origin: { type: GraphQLNonNull(GraphQLString) },
    destination: { type: GraphQLNonNull(GraphQLString) },
    empty_return: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLNonNull(GraphQLString) },
    receiver: { type: GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLString },

    client: {
      type: ClientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    jobs: {
      type: new GraphQLList(JobType),
      resolve(parent, args) {
        return Job.find();
      },
    },

    job: {
      type: JobType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Job.findById(args.id);
      },
    },

    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      },
    },

    client: {
      type: ClientType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
  },
});

//mutations

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
        payment: { type: GraphQLNonNull(GraphQLString) },
        kra_pin: { type: GraphQLNonNull(GraphQLString) },
        location: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
          payment: args.payment,
          kra_pin: args.kra_pin,
          location: args.location,
        });
        return client.save();
      },
    },

    //delete client

    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        Job.find({ clientId: args.id }).then((jobs) => {
          jobs.forEach((job) => {
            job.remove();
          });
        });
        return Client.findByIdAndRemove(args.id);
      },
    },

    //add projects

    addJob: {
      type: JobType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        container: { type: GraphQLNonNull(GraphQLString) },
        size: { type: GraphQLNonNull(GraphQLString) },
        weight: { type: GraphQLNonNull(GraphQLString) },
        origin: { type: GraphQLNonNull(GraphQLString) },
        destination: { type: GraphQLNonNull(GraphQLString) },
        empty_return: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        receiver: { type: GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "JobStatus",
            values: {
              new: { value: "Not Allocated" },
              allocated: { value: "Allocated Waiting Pick-Up" },
              arrived_loading: { value: "Arrived At Loading Site" },
              gate_loading: { value: "Gated In At Loading Site" },
              loaded: { value: "Loaded Waiting release" },
              on_journey: { value: "On Route To Client" },
              arrival_at_destination: { value: "Arrival At Offloading" },
              offloading: { value: "Offloading" },
              offloaded_on_return_journey: { value: "Empty Return Journey" },
              completed: { value: "Completed" },
            },
          }),
          defaultValue: "Not Allocated",
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const job = new Job({
          name: args.name,
          container: args.container,
          size: args.size,
          weight: args.weight,
          origin: args.origin,
          destination: args.destination,
          empty_return: args.empty_return,
          description: args.description,
          receiver: args.receiver,
          status: args.status,
          clientId: args.clientId,
        });
        return job.save();
      },
    },
    //delete job
    deleteJob: {
      type: JobType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Job.findByIdAndRemove(args.id);
      },
    },

    //update job
    updateJob: {
      type: JobType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        container: { type: GraphQLString },
        size: { type: GraphQLString },
        weight: { type: GraphQLString },
        origin: { type: GraphQLString },
        destination: { type: GraphQLString },
        empty_return: { type: GraphQLString },
        description: { type: GraphQLString },
        receiver: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: "JobStatusUpdate",
            values: {
              new: { value: "Not Allocated" },
              allocated: { value: "Allocated Waiting Pick-Up" },
              arrived_loading: { value: "Arrived At Loading Site" },
              gate_loading: { value: "Gated In At Loading Site" },
              loaded: { value: "Loaded Waiting release" },
              on_journey: { value: "On Route To Client" },
              arrival_at_destination: { value: "Arrival At Offloading" },
              offloading: { value: "Offloading" },
              offloaded_on_return_journey: { value: "Empty Return Journey" },
              completed: { value: "Completed" },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Job.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              container: args.container,
              size: args.size,
              weight: args.weight,
              origin: args.origin,
              destination: args.destination,
              empty_return: args.empty_return,
              description: args.description,
              receiver: args.receiver,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
