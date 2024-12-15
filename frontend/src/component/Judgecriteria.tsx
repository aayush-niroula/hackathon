import { Award, Star, CheckCircle, Users, Layout, Mic } from "lucide-react";
import { motion } from "framer-motion";

const Judgecriteria = () => {
  const criteriaDetails = [
    {
      key: "presentation",
      title: "Presentation",
      icon: <Mic className="text-blue-500" />,
      maxScore: 5,
      description: "Evaluate the clarity, confidence, and overall delivery during the project presentation.",
      subCriteria: [
        "Clarity of explanation",
        "Engagement with the audience",
        "Confidence in delivery",
        "Use of visual aids",
      ],
    },
    {
      key: "uiux",
      title: "UI/UX",
      icon: <Layout className="text-purple-500" />,
      maxScore: 5,
      description: "Assess the intuitiveness, aesthetic appeal, and usability of the project interface.",
      subCriteria: [
        "Intuitive navigation",
        "Consistency in design",
        "Visual hierarchy",
        "Accessibility considerations",
      ],
    },
    {
      key: "creativity",
      title: "Creativity",
      icon: <Star className="text-orange-500" />,
      maxScore: 5,
      description: "Judge the originality, innovation, and creative problem-solving demonstrated in the project.",
      subCriteria: [
        "Novel approach to the problem",
        "Creative design elements",
        "Innovative interaction paradigms",
        "Unique features",
      ],
    },
    {
      key: "qna",
      title: "Q&A",
      icon: <CheckCircle className="text-green-500" />,
      maxScore: 5,
      description: "Evaluate the team’s ability to answer questions clearly and demonstrate depth of knowledge.",
      subCriteria: [
        "Clarity in responses",
        "Depth of knowledge",
        "Team collaboration in answers",
        "Handling challenging questions",
      ],
    },
    {
      key: "teamwork",
      title: "Teamwork",
      icon: <Users className="text-red-500" />,
      maxScore: 5,
      description: "Assess the collaboration, communication, and effective division of responsibilities within the team.",
      subCriteria: [
        "Effective communication",
        "Equal participation",
        "Conflict resolution",
        "Clear division of roles",
      ],
    },
  ];

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        className="text-2xl font-bold mb-6 text-center flex items-center justify-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Award className="mr-3 text-yellow-500" />
        Hackathon Project Judging Criteria
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-4">
        {criteriaDetails.map((criteria, _index) => (
          <motion.div
            key={criteria.key}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center mb-3">
              {criteria.icon}
              <h2 className="ml-3 font-semibold text-lg">{criteria.title}</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">{criteria.description}</p>

            <div className="mb-3">
              <h3 className="font-medium mb-2">Sub-Criteria:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {criteria.subCriteria.map((sub, idx) => (
                  <motion.li key={idx} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }}>
                    {sub}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex items-center">
              <span className="ml-2 text-gray-500">/ {criteria.maxScore}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-6 bg-gray-100 rounded-lg p-4 text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold mb-3">Total Score</h3>
        <div className="text-2xl font-semibold">25</div>
        <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
          ></motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Judgecriteria;
