import { Star, CheckCircle, Users, Layout, Mic } from "lucide-react";
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
      description: "Evaluate the team's ability to answer questions clearly and demonstrate depth of knowledge.",
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
      {/* Header with Logo and Title */}
      <div className="flex items-center justify-center mb-8 space-x-4">
        <img
          src="/images.png" 
          alt="AIMS CODE QUEST 2.0 Logo" 
          width={80} 
          height={80} 
          className="rounded-full shadow-md"
        />
        <h1 className="text-3xl font-bold text-gray-800">
          AIMS CODE QUEST 2.0
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {criteriaDetails.map((criteria) => (
          <div
            key={criteria.key}
            className="border rounded-lg p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center mb-3">
              {criteria.icon}
              <h2 className="ml-3 font-semibold text-lg">{criteria.title}</h2>
              <span className="ml-auto text-gray-500 font-bold">
                {criteria.maxScore}/5
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{criteria.description}</p>

            <div className="mb-3">
              <h3 className="font-medium mb-2">Sub-Criteria:</h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {criteria.subCriteria.map((sub, idx) => (
                  <li key={idx} className="py-1">
                    {sub}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-100 rounded-lg p-4 text-center">
        <h3 className="text-xl font-bold mb-3">Total Score</h3>
        <div className="text-2xl font-semibold text-gray-800">25</div>
      </div>
    </motion.div>
  );
};

export default Judgecriteria;